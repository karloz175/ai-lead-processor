from app.models.lead import Lead


def push_to_hubspot(lead: Lead) -> None:
    """
    Mock HubSpot integration.
    In production, replace this with a real HubSpot API call.
    """
    print(f"[HubSpot] Pushing lead to CRM:")
    print(f"  Name:           {lead.name}")
    print(f"  Email:          {lead.email}")
    print(f"  Company:        {lead.company or 'N/A'}")
    print(f"  Classification: {lead.classification}")
    print(f"  Score:          {lead.score}/10")
    print(f"  Reason:         {lead.ai_reason}")
    print(f"[HubSpot] Done. Lead would be created in CRM.")
