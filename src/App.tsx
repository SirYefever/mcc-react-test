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

type FolderProps = {
      folder: Folder;
      handleSelect: (id: number) => void;
      setExpanded: (id: number) => void;
      expandedFolderIds: Set<number>;
}

enum ActionMethod {
      Add,
      Edit
}

const foldersInitial: Folder[] = [
      {
            id: 0,
            name: "Pictures",
            contents: [{
                  id: 1,
                  name: "2010s",
                  contents: [{
                        id: 2,
                        name: "2011s",
                        contents: [{
                              id: 3,
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
      const [actionMethod, setActionMethod] = useState<ActionMethod>(ActionMethod.Add);
      const [expandedFolderIds, setExpandedFolderIds] = useState<Set<number>>(new Set<number>);

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
                  selectedIds.delete(id);
            })
      }

      const toggleModalAdd = () => {
            setActionMethod(ActionMethod.Add);
            setIsModalOpen(!isModalOpen);
      }

      const toggleModalEdit = () => {
            setActionMethod(ActionMethod.Edit);
            setIsModalOpen(!isModalOpen);
      }

      const [inputString, setInputString] = useState<string>("");

      const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            setInputString(event.target.value);
      }

      const addNewFolder = (id: number) => {
            if (id === undefined) {
                  folders.push({
                        id: idIterator,
                        contents: undefined,
                        name: inputString
                  })
                  setFolders(folders);
                  setIdIterator(prev => prev+1);
                  toggleModalAdd();
                  return;
            }

            const elementToAppend = GetFolderRecursively(folders, id);
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
                  toggleModalAdd();
            }
      };

      const editFolder = (id: number) => {
            const elementToEdit = GetFolderRecursively(folders, id);
            if (elementToEdit) {
                  elementToEdit.name = inputString;
            }
            setFolders(folders);
            toggleModalAdd();
      }

      const onSave = () => {
            const selectedId = [...selectedIds][0];
            switch (actionMethod) {
                  case ActionMethod.Add:
                        addNewFolder(selectedId);
                        break;

                  case ActionMethod.Edit:
                        editFolder(selectedId);
            }
      }

      const toggleFolderExpansion = (idToToggle: number) => {
            setExpandedFolderIds(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(idToToggle)) {
                        newSet.delete(idToToggle);
                  } else {
                        newSet.add(idToToggle);
                  }
                  return newSet;
            })
      }

      const handleReset = () => {
            expandedFolderIds.forEach((id) => {toggleFolderExpansion(id)});
      }


      return (
          <>
                <Modal inputValue={inputString} onInputChange={onInputChange} onSave={onSave} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                <ul className={"tree"}>
                      {folders.map((folder: Folder) => (
                          <Folder folder={folder} handleSelect={handleSelect} key={folder.id} setExpanded={toggleFolderExpansion} expandedFolderIds={expandedFolderIds} />
                      ))}
                </ul>
                <div className={"buttons-div"}>
                      <button onClick={toggleModalAdd}
                              className={(selectedIds.size === 1 || selectedIds.size === 0) ? ("my-btn") : ("my-inactive-btn my-btn")}>Add
                      </button>
                      <button onClick={handleRemove} className={"my-btn"}>Remove</button>
                      <button onClick={toggleModalEdit}
                              className={selectedIds.size === 1 ? ("my-btn") : ("my-inactive-btn my-btn")}>Edit
                      </button>
                      <button onClick={handleReset} className={"my-btn"}>Reset</button>
                </div>
          </>
      )
}

function Folder(props: FolderProps) {
      const isExpanded = props.expandedFolderIds.has(props.folder.id);
      const expand = () => {
            props.setExpanded(props.folder.id);
      }

      const [isSelected, setSelected] = useState<boolean>(false);
      const select = () => {
            setSelected(!isSelected);
            props.handleSelect(props.folder.id);
      }

      return (
          <li className={"tree-node"} >
                <span className={ isSelected ? ("selected-node-span") : ("node-span")} >
                      {props.folder.contents ? (
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
                      <p className={"file-name"} onClick={select}>{props.folder.name}</p>
          </span>
                {isExpanded && (
                    <ul>
                          {props.folder.contents?.map(folder => (
                              <Folder folder={folder} handleSelect={props.handleSelect} key={folder.id} setExpanded={props.setExpanded} expandedFolderIds={props.expandedFolderIds} />
                          ))}
                    </ul>
                )}
          </li>
      )
}

export default App
