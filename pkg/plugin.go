package main

import (
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/naizerjohn-ms/azure-data-explorer-datasource/pkg/azuredx"
)

func main() {
	backend.SetupPluginEnvironment("grafana-azure-data-explorer-datasource")

	if err := datasource.Manage("azure-data-explorer", azuredx.NewDatasource, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
