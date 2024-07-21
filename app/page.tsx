import Link from "next/link";

export default function Home({db, test}: any) {
  return (
    <div className="container px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Eirene</h1>
        <p className="text-lg text-gray-700">
          This is a playground for working with the OMOP CDM, using the <Link
            href="https://github.com/OHDSI/EunomiaDatasets"
            className="text-blue-500 hover:underline"
          >
            Eunomia Datasets
          </Link>.
          Please note that queries must be written in SQLite. For more information on SQLite, visit the <Link
            href="https://www.sqlite.org/"
            className="text-blue-500 hover:underline"
          >
            SQLite Documentation
          </Link>.
        </p>
      </header>

      <main>
        <p className="text-lg text-gray-700">
          You can explore and run queries in SQLite in the <Link
            href="/playground"
            className="text-blue-500 hover:underline"
          >
            Playground
          </Link> section.
        </p>
      </main>
    </div>
  )
}
