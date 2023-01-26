const toogleSidebar = (action,sidebarSelect,setSidebarSelect) => {
    if(action === "Commentary"){
        switch (sidebarSelect){
            case "Disable":
                setSidebarSelect("Commentary");
                break;
            case "None":
                setSidebarSelect("Commentary");
                break;
            case "Commentary":
                setSidebarSelect("None");
                break;
            case "List":
                setSidebarSelect("Commentary");
                break;
        }
    }
    if(action === "List"){
        switch (sidebarSelect) {
            case "Disable":
                setSidebarSelect("List");
                break;
            case "None":
                setSidebarSelect("List");
                break;
            case "List":
                setSidebarSelect("None");
                break;
            case "Commentary":
                setSidebarSelect("List");
                break;
        }
    }
    return null;
}
export default toogleSidebar;