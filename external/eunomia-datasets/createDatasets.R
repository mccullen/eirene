# Downloading sqlite files from EunomiaDatasets

# To install Eunomia
#remotes::install_github("https://github.com/OHDSI/Eunomia")
library(Eunomia)
library(DatabaseConnector)

# Downloads dataset from EunomiaDatasets and output to "to" location
# See below for usage examples
createEunomiaDataset <- function(
    cohort=TRUE,
    datasetName="GiBleed",
    cdmVersion="5.3",
    pathToData=".", 
    overwrite=FALSE,
    verbose=FALSE,
    dbms = "sqlite",
    inputFormat = "csv"
    ) {
  to=paste0(pathToData, datasetName, "_", cdmVersion, "_db", ".", dbms)
  # Download dataset
  message("downloadEunomiaData(): Downloading eunomia data")
  downloadEunomiaData(
    datasetName=datasetName,
    cdmVersion = cdmVersion,
    pathToData = pathToData,
    overwrite = overwrite,
    verbose = verbose
  )
  from <- paste0(pathToData, datasetName, "_", cdmVersion, ".zip")
  msg <- paste0("extractLoadData(): ", "from=", from, ", to=", to)
  if (file.exists(to)) {
    removed = file.remove(to)
  }
  message(msg)
  # Create sql lite from zip files
  extractLoadData(
    from=from,
    to=to,
    dbms = dbms,
    cdmVersion = cdmVersion,
    inputFormat = inputFormat,
    verbose = verbose
  )
  
  if (cohort) {
    # Connect to sqlite
    message("Connecting to sqlite we just created to add cohorts")
    connectionDetails = createConnectionDetails(dbms=dbms, server = to)
    connection <- connect(connectionDetails)
  
    # Add cohorts
    message("Adding cohorts")
    createCohorts(connectionDetails)
    disconnect(connection)
  }
  zipfile <- sub("\\.[[:alnum:]]+$", ".zip", to)
  zip(zipfile = zipfile, files = to, extras="-j")
}

pathToData = "./datasets/"

########################
createEunomiaDataset(
    cohort=TRUE,
    datasetName="GiBleed",
    cdmVersion="5.3",
    pathToData=pathToData, 
    overwrite=TRUE,
    verbose=FALSE,
    dbms = "sqlite",
    inputFormat = "csv"
)


createEunomiaDataset(
    cohort=TRUE,
    datasetName="MIMIC",
    cdmVersion="5.3",
    pathToData=pathToData, 
    overwrite=TRUE,
    verbose=FALSE,
    dbms = "sqlite",
    inputFormat = "csv"
)

createEunomiaDataset(
    cohort=TRUE,
    datasetName="Synthea27Nj",
    cdmVersion="5.4",
    pathToData=pathToData, 
    overwrite=TRUE,
    verbose=FALSE,
    dbms = "sqlite",
    inputFormat = "csv"
)
