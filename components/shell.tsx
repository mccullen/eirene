"use client"
import { useEffect, createContext, useState, useRef } from 'react';
import Link from 'next/link';
import initSqlJs from "sql.js";
import JSZip from 'jszip';

const GlobalContext = createContext<any>(null);
export { GlobalContext };


export default function Shell({ children }: any) {
    let mobileMenu = useRef<any>(null);
    let [db, setDb] = useState<any>();

    // Put the DB into a global context so it persists across pages in the layout
    useEffect(() => {
        async function init() {
          console.log("init");
          const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => {
                return file;
              }
          });
          const response = await fetch("cdm.sqlite");
          const buffer = await response.arrayBuffer();
          let tmp = new SQL.Database(new Uint8Array(buffer));
          let r = tmp.exec("select * from person;");
          setDb(tmp);
        }
        async function init2() {
          const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => {
                return file;
              }
          });
          console.log("init2");
          const response = await fetch("GiBleed_5.3_db.zip");
          const buffer = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(buffer);
          const file = zip.file("GiBleed_5.3_db.sqlite");
          const sqliteBuffer: ArrayBuffer = await file?.async("arraybuffer") as ArrayBuffer;

          if (sqliteBuffer) {
            let tmp = new SQL.Database(new Uint8Array(sqliteBuffer));
            let r = tmp.exec("select * from person;");
            setDb(tmp);
          }
        }
        async function init3() {
          const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => {
                return file;
              }
          });
          console.log("init3");
          const response = await fetch("https://raw.githubusercontent.com/OHDSI/EunomiaDatasets/main/datasets/GiBleed/GiBleed_5.3.zip");
          debugger;
          const buffer = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(buffer);
          const file = zip.file("cdm.sqlite");
          const sqliteBuffer = await file?.async("arraybuffer");

          let tmp = new SQL.Database(new Uint8Array(sqliteBuffer as ArrayBuffer));
          let r = tmp.exec("select * from person;");
          setDb(tmp);
        }
        init2();
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

                  {/* promary nav */}
                  <div className="hidden md:flex items-center space-x-1">
                    <Link href="/" className="py-5 px-3 text-gray-700 hover:text-gray-900 transition duration-300">Home</Link>
                    <Link href="/playground" className="py-5 px-3 text-gray-700 hover:text-blue-600 transition duration-300">Playground</Link>
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
              <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Home</Link>
              <Link href="/playground" className="block py-2 px-4 text-sm hover:bg-gray-200">Playground</Link>
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