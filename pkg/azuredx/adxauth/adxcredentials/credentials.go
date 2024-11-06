package adxcredentials

import (
	"github.com/naizerjohn-ms/grafana-azure-sdk-go/azcredentials"
	"github.com/naizerjohn-ms/grafana-azure-sdk-go/azsettings"
)

func GetDefaultCredentials(settings *azsettings.AzureSettings) azcredentials.AzureCredentials {
	if settings.ManagedIdentityEnabled {
		return &azcredentials.AzureManagedIdentityCredentials{}
	} else {
		return &azcredentials.AzureClientSecretCredentials{AzureCloud: settings.GetDefaultCloud()}
	}
}
