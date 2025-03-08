import { App, Plugin, PluginSettingTab } from "obsidian";

export default class DropdownMenuPlugin extends Plugin {
	async onload() {
		console.log("Loading Dropdown Menu plugin");

		// Register markdown post processor for dropdown syntax
		this.registerMarkdownCodeBlockProcessor("dropdown", (source, el) => {
			const dropdownContainer = el.createDiv({
				cls: "dropdown-container",
			});

			try {
				const dropdownData = JSON.parse(source);
				const select = dropdownContainer.createEl("select", {
					cls: "dropdown-menu",
				});

				// Add default option
				select.createEl("option", {
					text: dropdownData.placeholder || "Select an option...",
					attr: { value: "", disabled: true, selected: true },
				});

				// Add options from source
				if (
					dropdownData.options &&
					Array.isArray(dropdownData.options)
				) {
					dropdownData.options.forEach(
						(option: string | { value: string; label: string }) => {
							if (typeof option === "string") {
								select.createEl("option", {
									text: option,
									attr: { value: option },
								});
							} else {
								select.createEl("option", {
									text: option.label,
									attr: { value: option.value },
								});
							}
						},
					);
				}

				// Add event listener
				select.addEventListener("change", (event) => {
					const target = event.target as HTMLSelectElement;
					console.log("Selected:", target.value);
				});
			} catch (e) {
				dropdownContainer.setText(
					"Error parsing dropdown menu data: " + (e as Error).message,
				);
			}
		});

		// Add settings
		this.addSettingTab(new DropdownMenuSettingTab(this.app, this));
	}

	onunload() {
		console.log("Unloading Dropdown Menu plugin");
	}
}

class DropdownMenuSettingTab extends PluginSettingTab {
	plugin: DropdownMenuPlugin;

	constructor(app: App, plugin: DropdownMenuPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Dropdown Menu Settings" });
	}
}
