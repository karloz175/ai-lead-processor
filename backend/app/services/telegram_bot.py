from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

from app.config import settings
from app.database import SessionLocal
from app.models.lead import Lead
from app.services.ai_analyzer import analyze_lead
from app.services.hubspot import push_to_hubspot


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Hello! I'm the AI Lead Processor bot.\n\n"
        "Send me a message describing your interest and I'll analyze it as a lead.\n\n"
        "Example: 'Hi, my name is Jan Kowalski from BigCorp. We need an enterprise CRM, budget 50k PLN.'"
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user
    text = update.message.text

    name = user.full_name or "Unknown"
    email = f"telegram_{user.id}@telegram.user"
    message = text

    await update.message.reply_text("🔍 Analyzing your message with AI, please wait...")

    analysis = analyze_lead(name=name, company=None, message=message)

    db = SessionLocal()
    try:
        db_lead = Lead(
            name=name,
            email=email,
            company=None,
            message=message,
            classification=analysis["classification"],
            score=analysis["score"],
            ai_reason=analysis["ai_reason"],
        )
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        push_to_hubspot(db_lead)
    finally:
        db.close()

    emoji = "🔥" if analysis["classification"] == "hot" else "❄️"
    await update.message.reply_text(
        f"{emoji} Analysis complete!\n\n"
        f"Classification: {analysis['classification'].upper()}\n"
        f"Score: {analysis['score']}/10\n"
        f"Reason: {analysis['ai_reason']}"
    )


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"[Telegram Bot] Error: {context.error}")


def run_bot():
    print("[Telegram Bot] Starting...")
    app = Application.builder().token(settings.telegram_bot_token).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_error_handler(error_handler)

    print("[Telegram Bot] Polling...")
    app.run_polling(poll_interval=3)
