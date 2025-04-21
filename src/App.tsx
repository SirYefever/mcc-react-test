import folderIco from './resources/folder.png';
import fileIco from './resources/file.png';
import './index.css'
import {ShevronRight} from "./components/ShevronRight.tsx";
import {useState} from "react";
import {ShevronDown} from "./components/ShevronDown.tsx";

type Folder = {
      name: string;
      contents?: Folder[];
}

const folders: Folder[] = [
      {
            name: "Pictures",
            contents: [{
                  name: "2010s",
                  contents: [{
                        name: "2011s",
                        contents: [{
                              name: "2012s",
                              contents: []
                        }]
                  }]
            }]
      },
      {
            name: "Movies",
            contents: [
                  {
                        name: "The.Wire.S04E09.720p.Eng.mkv"
                  }
            ]
      },

]

function App() {
      return (
          <ul className={"tree"}>
                {folders.map((folder: Folder) => (
                      <Folder folder={folder} />
                ))}
          </ul>
  )
}

function Folder({folder}: {folder: Folder}) {
      let [isExpanded, setExpanded] = useState(false);

      const expand = () => setExpanded(!isExpanded);

      return (
          <li className={"tree-node"} key={folder.name}>
                <span onClick={expand} >
                      {folder.contents ? (
                          <>
                                {isExpanded ? (
                                    <ShevronDown />
                                ) : (
                                    <ShevronRight />
                                )}
                                <img alt={"📁"} src={folderIco} className={"ico"}/>
                          </>
                      ) : (
                          <img alt={"🗎"} src={fileIco} className={"ico"}/>
                      )}
                      {folder.name}
          </span>
                {isExpanded && (
                    <ul>
                          {folder.contents?.map(folder => (
                              <Folder folder={folder}/>
                          ))}
                    </ul>
                )}
          </li>
      )
}

export default App
