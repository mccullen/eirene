import Link from "next/link";
const linkClassName = "text-blue-500 hover:underline";

export default function Home({db, test}: any) {
  return (
    <div className="container px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Eirene</h1>
        <p className="text-lg text-gray-700">
          This is a playground for working with the OMOP CDM, using the&nbsp;
          <a 
            href="https://github.com/OHDSI/EunomiaDatasets" 
            className={linkClassName} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Eunomia Datasets
          </a>.
          Please note that queries must be written in&nbsp;
            <a 
              className={linkClassName} 
              href="https://www.sqlite.org/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              SQLite
            </a> or&nbsp;
            <a 
              className={linkClassName} 
              href="https://ohdsi.github.io/TheBookOfOhdsi/SqlAndR.html" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              OHDSI SQL
            </a>. 
        </p>
      </header>

      <main>
        <p className="text-lg text-gray-700">
          You can explore and run queries in the&nbsp; 
          <Link href="/playground" className={linkClassName}>
            Playground
          </Link> section.
        </p>
      </main>
    </div>
  )
}
