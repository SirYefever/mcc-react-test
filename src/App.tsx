import folderIco from './resources/folder.png';
import fileIco from './resources/file.png';
import './index.css'
import {ShevronRight} from "./components/ShevronRight.tsx";
import {ChangeEvent, useState} from "react";
import {ShevronDown} from "./components/ShevronDown.tsx";
import {Modal} from "./components/Modal.tsx";

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
                        name: "The.Wire.S04E09.720p.Eng.mkv",
                        contents: []
                  }
            ]
      },

]

function GetFolderRecursively(folders: Folder[], idToGet: number): Folder | null {
      let result: Folder | null = null;
      for (let i = 0; i < folders.length; i++) {
            const currentFolder = folders[i];

            if (currentFolder.id === idToGet) {
                  return currentFolder;
            } else {
                  if (currentFolder.contents){
                        result = GetFolderRecursively(currentFolder.contents, idToGet);
                  }

                  if (result){
                        return result;
                  }
            }
      }
      return null;
}

function DeleteFolderRecursively(folders: Folder[], idToRemove: number): Folder[] {
      return folders
          .filter(f => f.id !== idToRemove)
          .map(f => ({
                ...f,
                contents: f.contents ? DeleteFolderRecursively(f.contents, idToRemove) : undefined
          }))
}

function App() {
      const [selectedIds, setSelectedIds] = useState(new Set<number>());
      const [folders, setFolders] = useState<Folder[]>(foldersInitial);
      const [idIterator, setIdIterator] = useState(6);
      const [isModalOpen, setIsModalOpen] = useState(false);

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
            selectedIds.forEach((id) => {
                  setFolders(prev => DeleteFolderRecursively(prev, id));
            })
      }

      const toggleModal = () => {
            setIsModalOpen(!isModalOpen);
      }

      const [inputString, setInputString] = useState<string>("");

      const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            setInputString(event.target.value);
      }

      const onSave = () => {
            const selectedId = [...selectedIds][0];
            const elementToAppend = GetFolderRecursively(folders, selectedId);
            if (elementToAppend) {
                  if (elementToAppend.contents){
                        elementToAppend.contents.push({
                              id: idIterator,
                              contents: undefined,
                              name: inputString
                        })
                  } else {
                        elementToAppend.contents = [{
                              id: idIterator,
                              contents: undefined,
                              name: inputString
                        }]
                  }
                  setFolders(folders);
                  setIdIterator(prev => prev+1);
                  toggleModal();
            }
      }


      return (
          <>
                <Modal inputValue={inputString} onInputChange={onInputChange} onSave={onSave} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                <ul className={"tree"}>
                      {folders.map((folder: Folder) => (
                          <Folder folder={folder} handleSelect={handleSelect}/>
                      ))}
                </ul>
                <div className={"buttons-div"}>
                      <button onClick={toggleModal} className={selectedIds.size === 1 ? ("my-btn") : ("my-inactive-btn my-btn")}>Add</button>
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
