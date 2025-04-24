import './index.css'
import {ChangeEvent, useEffect, useState} from "react";
import {Modal} from "./components/Modal.tsx";
import {Folder} from "./components/Folder.tsx";



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
                  name: "2025",
                  contents: [
                        {
                              id:17,
                              name: "IMG_20250307_114534.jpg",
                              contents: undefined,
                        },
                        {
                              id:18,
                              name: "IMG_20250307_114549.jpg",
                              contents: undefined,
                        },
                        {
                              id:19,
                              name: "IMG_20250307_114551.jpg",
                              contents: undefined,
                        },
                        {
                              id:20,
                              name: "IMG_20250307_114555.jpg",
                              contents: undefined,
                        }
                  ]
            }]
      },
      {
            id: 4,
            name: "Videos",
            contents: [
                  {
                        id: 5,
                        name: "Movies",
                        contents: [
                              {
                                    id: 6,
                                    name: "The.Wire.Complete.Series.720p.BluRay.2xRus.Eng.E180",
                                    contents: [
                                          {
                                                id: 7,
                                                name: "The.Wire.S04E09.720p.BluRay.2xRus.Eng.E180.mkv",
                                                contents: undefined,
                                          },
                                          {
                                                id: 8,
                                                name: "The.Wire.S04E10.720p.BluRay.2xRus.Eng.E180.mkv",
                                                contents: undefined,
                                          },
                                          {
                                                id: 9,
                                                name: "The.Wire.S04E11.720p.BluRay.2xRus.Eng.E180.mkv",
                                                contents: undefined,
                                          },
                                          {
                                                id: 10,
                                                name: "The.Wire.S04E12.720p.BluRay.2xRus.Eng.E180.mkv",
                                                contents: undefined,
                                          },
                                    ]
                              },
                              {
                                    id: 15,
                                    name: "Intouchables 2011.mkv",
                                    contents: undefined,
                              },
                              {
                                    id: 16,
                                    name: "Шрек 5 трейлер.mkv",
                                    contents: undefined,
                              }
                        ]
                  },
                  {
                        name: "OBS",
                        id: 11,
                        contents: [
                              {
                                    name: "2024-03-27 03-45-48.mp4",
                                    id: 12,
                                    contents: undefined,
                              },
                              {
                                    name: "2023-10-20 02-51-15 — копия.mkv",
                                    id: 13,
                                    contents: undefined,
                              },
                              {
                                    name: "2024-09-26 08-46-29.mkv",
                                    id: 14,
                                    contents: undefined,
                              },

                        ]
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
                contents: f.contents ? DeleteFolderRecursively(f.contents, idToRemove) : f.contents
          }));
}

function App() {
      const [folders, setFolders] = useState<Folder[]>(foldersInitial);
      const [idIterator, setIdIterator] = useState(22);
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
            console.log("add called.");

            setFolders(prevFolders => {
                  const newFolder = {
                        id: idIterator,
                        contents: undefined,
                        name: inputString
                  };

                  let updatedFolders = [...prevFolders];

                  if (id === undefined) {
                        updatedFolders = [...updatedFolders, newFolder];
                  } else {
                        const elementToAppend = GetFolderRecursively(updatedFolders, id);
                        if (elementToAppend) {
                              if (elementToAppend.contents) {
                                    elementToAppend.contents = [...elementToAppend.contents, newFolder];
                              } else {
                                    elementToAppend.contents = [newFolder];
                              }
                        }
                  }
                  return updatedFolders;
            });

            setIdIterator(prev => prev + 1);
            toggleModalAdd();
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

      useEffect(() => {
            console.log('selectedIds updated:', Array.from(selectedIds));
      }, [selectedIds]);

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
