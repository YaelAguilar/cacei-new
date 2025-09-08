import { makeAutoObservable } from "mobx";
import { MenuViewModel } from "./MenuViewModel";
import { SubmenuViewModel } from "./SubmenuViewModel";


export class NavigationSettingsViewModel {

    activeTab: "menu" | "submenu" = "menu";
    isModalOpen: boolean = false;
    menuViewModel: MenuViewModel;
    submenuViewModel: SubmenuViewModel;

    constructor() {
        makeAutoObservable(this);
        this.menuViewModel = new MenuViewModel(this);
        this.submenuViewModel = new SubmenuViewModel(this);
    }

    setActiveTab(tab: "menu" | "submenu") {
        this.activeTab = tab;
    }

    isActiveTab(tab: "menu" | "submenu") {
        return this.activeTab === tab;
    }

    prepareForCreate() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    get mainActionLabel() {
        return this.activeTab === "menu" ? "Nuevo menú" : "Nuevo submenú";
    }

    get modalTitle() {
        return this.activeTab === "menu"
            ? "Información del Menú"
            : "Información del Submenú";
    }

    get modalSubtitle() {
        return this.activeTab === "menu"
            ? "Ingresa los detalles para crear un nuevo menú."
            : "Ingresa los detalles para crear un nuevo submenú.";
    }

    get currentViewModel() {
        return this.activeTab === "menu" 
            ? this.menuViewModel 
            : this.submenuViewModel;
    }
}
