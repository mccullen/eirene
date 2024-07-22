"use client"
import { useEffect, createContext, useState, useRef } from 'react';
import Link from 'next/link';
import initSqlJs from "sql.js";
import JSZip from 'jszip';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    id: "home",
    name: "Home",
    path: "/"
  },
  {
    id: "playground",
    name: "Playground",
    path: "/playground"
  },
];

const GlobalContext = createContext<any>(null);
export { GlobalContext };


export default function Shell({ children }: any) {
    const pathname = usePathname();
    let mobileMenu = useRef<any>(null);
    let [db, setDb] = useState<any>();

    // Put the DB into a global context so it persists across pages in the layout
    useEffect(() => {
        async function init() {
          const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => {
                console.log(file);
                return file;
              }
          });
          const response = await fetch("GiBleed_5.3_db.zip");
          const buffer = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(buffer);
          const file = zip.file("GiBleed_5.3_db.sqlite");
          const sqliteBuffer: ArrayBuffer = await file?.async("arraybuffer") as ArrayBuffer;

          if (sqliteBuffer) {
            try {
              let tmp = new SQL.Database(new Uint8Array(sqliteBuffer));
              setDb(tmp);
            } catch (error) {
              console.error(error);
            }
          }
        }
        init();
      }, []);
    return (
        <GlobalContext.Provider value={db}>
          {/* Navbar goes here */}
          <nav className="bg-gray-100">
            {/* overall container */}
            <div className="px-8 mx-auto">
              {/* side-by-side flex container */}
              <div className="flex justify-between">
                {/* left-aligned items */}
                <div className="flex space-x-4 items-center">
                  {/* logo */}
                  <div className="font-bold">
                    <Link href="/" className="py-5 px-3 text-gray-700">Eirene</Link>
                  </div>

                  {/* primary nav */}
                  <div className="hidden md:flex items-center space-x-1">
                    {
                      navItems.map(({id, name, path}) => {
                        const isActive = pathname === path;
                        return (
                          <Link
                            key={path}
                            id={id}
                            href={path}
                            className={`py-5 px-3 text-gray-700 hover:text-blue-600 transition duration-300  ${isActive ? 'text-blue-600 font-bold' : ''}`}
                          >
                            {name}
                          </Link>
                        );
                      })
                    }
                    {/*<Link href="/tutorial" className="py-5 px-3 text-gray-700 hover:text-gray-900 transition duration-300">Tutorial</Link>*/}
                  </div>
                </div>

                {/* mobile button */}
                <div className="md:hidden flex items-center py-5 px-3">
                  <button className="mobile-menu-button" onClick={ event => {
                    mobileMenu.current.classList.toggle("hidden");
                  } }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* mobile menu */}
            <div ref={mobileMenu} className="mobile-menu hidden">
              <Link id="home-mobile-link" href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Home</Link>
              <Link id="playground-mobile-link" href="/playground" className="block py-2 px-4 text-sm hover:bg-gray-200">Playground</Link>
              <Link href="tutorial" className="block py-2 px-4 text-sm hover:bg-gray-200">Tutorial</Link>
            </div>
          </nav>

          {/* content goes here */}
          <div className="px-8">
            {children}
          </div>
        </GlobalContext.Provider>
    );
}