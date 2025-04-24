import './index.css'
import {ChangeEvent, useState} from "react";
import {Modal} from "./components/Modal.tsx";
import {Folder} from "./components/Folder.tsx";
import {foldersInitial} from "./folders.ts";

enum ActionMethod {
      Add,
      Edit
}


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
                contents: f.contents ? DeleteFolderRecursively(f.contents, idToRemove) : f.contents
          }));
}

function App() {
      const [folders, setFolders] = useState<Folder[]>(foldersInitial);
      const [idIterator, setIdIterator] = useState(22); // Use this default value because there is starting data.
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [actionMethod, setActionMethod] = useState<ActionMethod>(ActionMethod.Add);
      const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
      const [expandedFolderIds, setExpandedFolderIds] = useState<Set<number>>(new Set());

      const handleRemove = () => {
            setFolders(prev => {
                  let updated = prev;
                  selectedIds.forEach((id) => {
                        updated = DeleteFolderRecursively(updated, id);
                  });
                  return updated;
            });
            setSelectedIds(new Set());
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
            const newId = idIterator + 1;
            const newFolder = {
                  id: newId,
                  contents: undefined,
                  name: inputString
            };

            setFolders(prevFolders => {
                  if (id === undefined) {
                        return [...prevFolders, newFolder];
                  } else {
                        // Create a deep copy to avoid mutation
                        const updatedFolders = JSON.parse(JSON.stringify(prevFolders));

                        const elementToAppend = GetFolderRecursively(updatedFolders, id);
                        if (elementToAppend) {
                              if (elementToAppend.contents) {
                                    elementToAppend.contents = [...elementToAppend.contents, newFolder];
                              } else {
                                    elementToAppend.contents = [newFolder];
                              }
                        }
                        return updatedFolders;
                  }
            });

            setIdIterator(prev => prev + 1);
            setInputString(""); // Clear the input
            setIsModalOpen(false); // Close modal directly instead of toggle
      };

      const editFolder = (id: number) => {
            setFolders(prevFolders => {
                  return prevFolders.map(folder => {
                        if (folder.id === id) {
                              return { ...folder, name: inputString };
                        }
                        return folder;
                  });
            });
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
                        break;
            }
      }

      const toggleSelect = (idToToggle: number) => {
            setSelectedIds(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(idToToggle)) {
                        newSet.delete(idToToggle);
                  } else {
                        newSet.add(idToToggle);
                  }
                  return newSet;
            });
      };

      const toggleExpanded = (idToToggle: number) => {
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

      const unselectAll = () => {
            setSelectedIds(new Set<number>());
      };

      const handleReset = () => {
            setExpandedFolderIds(new Set<number>());
            unselectAll();
      }

      return (
          <>
                <Modal inputValue={inputString} onInputChange={onInputChange} onSave={onSave} isOpen={isModalOpen}
                       setIsOpen={setIsModalOpen}/>
                <div className="background-div">
                      <ul className={"tree"}>
                            {folders.map((folder: Folder) => (
                                <Folder folder={folder} key={folder.id} handleSelect={toggleSelect}
                                        selectedIds={selectedIds} setExpanded={toggleExpanded}
                                        expandedFolderIds={expandedFolderIds}/>
                            ))}
                      </ul>
                      <div className={"buttons-div"}>
                            <button onClick={toggleModalAdd}
                                    className={(selectedIds.size === 1 || selectedIds.size === 0) ? ("btn btn-outline-dark") : ("btn btn-outline-dark my-inactive-btn")}>Add
                            </button>
                            <button onClick={handleRemove} className={"btn btn-outline-dark"}>Remove</button>
                            <button onClick={toggleModalEdit}
                                    className={selectedIds.size === 1 ? ("btn btn-outline-dark") : ("btn btn-outline-dark my-inactive-btn")}>Edit
                            </button>
                            <button onClick={handleReset} className={"btn btn-outline-dark"}>Reset</button>
                      </div>
                </div>
          </>
      )
}


export default App
