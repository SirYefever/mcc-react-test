import {ShevronDown} from "./ShevronDown.tsx";
import {ShevronRight} from "./ShevronRight.tsx";
import folderIco from "../resources/folder.png";
import fileIco from "../resources/file.png";

export type Folder = {
      id: number;
      name: string;
      contents?: Folder[];
}

type FolderProps = {
      folder: Folder;
      handleSelect: (id: number) => void;
      selectedIds: Set<number>;
      setExpanded: (id: number) => void;
      expandedFolderIds: Set<number>;
}

export function Folder(props: FolderProps) {
      const isExpanded = props.expandedFolderIds.has(props.folder.id);
      const expand = () => {
            props.setExpanded(props.folder.id);
      }

      const isSelected = props.selectedIds.has(props.folder.id);
      const select = () => {
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
                              <Folder folder={folder} key={folder.id} handleSelect={props.handleSelect} selectedIds={props.selectedIds} setExpanded={props.setExpanded} expandedFolderIds={props.expandedFolderIds} />
                          ))}
                    </ul>
                )}
          </li>
      )
}
