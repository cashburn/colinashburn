## Add your Terraform outputs here ##
output "static_web_app_name" {
  value = azurerm_static_web_app.swa.name
}

output "static_web_app_default_host_name" {
  value = azurerm_static_web_app.swa.default_host_name
}

output "static_web_app_api_key" {
  value     = azurerm_static_web_app.swa.api_key
  sensitive = true
}
