resource "azurerm_resource_group" "resource_group" {
  name     = local.base_name
  location = var.location
}

## Add your Terraform resources here ##
resource "azurerm_static_web_app" "swa" {
  name                = local.base_name
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location # This may need to change based on region
  sku_tier            = "Free"
  sku_size            = "Free"
  tags = {
    app         = var.project_name
    environment = var.env
    managed_by  = "terraform"
  }
}

## IMPORTANT: Comment this out if you do not have a custom domain name!! ##
resource "azurerm_static_web_app_custom_domain" "custom_domain" {
  static_web_app_id = azurerm_static_web_app.swa.id
  domain_name       = var.app_url
  validation_type   = "dns-txt-token"
}
