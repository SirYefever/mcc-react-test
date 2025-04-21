import folderIco from './resources/folder.png';
import fileIco from './resources/file.png';
import './index.css'
import {ShevronRight} from "./components/ShevronRight.tsx";
import {useState} from "react";
import {ShevronDown} from "./components/ShevronDown.tsx";

type Folder = {
      id: number;
      name: string;
      contents?: Folder[];
}

const foldersInitial: Folder[] = [
      {
            id: 0,
            name: "Pictures",
            contents: [{
                  id: 3,
                  name: "2010s",
                  contents: [{
                        id: 1,
                        name: "2011s",
                        contents: [{
                              id: 2,
                              name: "2012s",
                              contents: []
                        }]
                  }]
            }]
      },
      {
            id: 4,
            name: "Movies",
            contents: [
                  {
                        id: 5,
                        name: "The.Wire.S04E09.720p.Eng.mkv"
                  }
            ]
      },

]

function App() {
      const [selectedIds, setSelectedIds] = useState(new Set<number>());
      const [folders, setFolders] = useState<Folder[]>(foldersInitial);

      const setFoldersNested = (folders: Folder[]) => {

      };

      const handleSelect = (id: number) => {
            setSelectedIds(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(id)) {
                        newSet.delete(id);
                  } else {
                        newSet.add(id);
                  }
                  return newSet;
            });
      };

      const handleRemove = () => {
            selectedIds.forEach(id =>{
                  setFolders(folders.filter(folder => folder.id === id));
                  setFoldersNested(folders.filter(folder => folder.id === id));
                }
            );

      }

      return (
          <>
                <ul className={"tree"}>
                      {folders.map((folder: Folder) => (
                          <Folder folder={folder} handleSelect={handleSelect}/>
                      ))}
                </ul>
                <div className={"buttons-div"}>
                      <button onClick={handleRemove} className={"my-btn"}>Remove</button>
                </div>
          </>
      )
}

function Folder({folder, handleSelect}: { folder: Folder, handleSelect: (id: number) => void }) {
      const [isExpanded, setExpanded] = useState(false);
      const expand = () => setExpanded(!isExpanded);

      const [isSelected, setSelected] = useState(false);
      const select = () => {
            setSelected(!isSelected);
            handleSelect(folder.id);
      }

      return (
          <li className={"tree-node"} key={folder.id}>
                <span className={ isSelected ? ("selected-node-span") : ("node-span")} >
                      {folder.contents ? (
                          <>
                                <button className={"my-btn"} onClick={expand}>
                                      {isExpanded ? (
                                          <ShevronDown />
                                      ) : (
                                          <ShevronRight />
                                      )}
                                </button>
                                <img alt={"📁"} src={folderIco} className={"folder-ico"}/>
                          </>
                      ) : (
                          <img alt={"🗎"} src={fileIco} className={"folder-ico"}/>
                      )}
                      <p className={"file-name"} onClick={select}>{folder.name}</p>
          </span>
                {isExpanded && (
                    <ul>
                          {folder.contents?.map(folder => (
                              <Folder folder={folder} handleSelect={handleSelect} />
                          ))}
                    </ul>
                )}
          </li>
      )
}

export default App
