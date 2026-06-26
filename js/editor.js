window.Editor = (() => {

    const cm = CodeMirror.fromTextArea(
        document.getElementById("editor"),
        {

            mode: "python",

            theme: "default",

            lineNumbers: true,

            indentUnit: 4,

            tabSize: 4,

            indentWithTabs: false,

            smartIndent: true,

            lineWrapping: false,

            autofocus: true,

            styleActiveLine: true,

            autoCloseBrackets: true,

            matchBrackets: true,

            extraKeys: {

                Tab(cm) {

                    if (cm.somethingSelected())
                        cm.indentSelection("add");
                    else
                        cm.replaceSelection("    ", "end");

                },

                "Ctrl-Enter": () => {

                    if (window.runCode)
                        window.runCode();

                }

            }

        }
    );

    // Autosave every edit
    cm.on("change", () => {

        const challenge =
            new URLSearchParams(location.search)
                .get("challenge");

        if (challenge) {

            localStorage.setItem(
                "editor_" + challenge,
                cm.getValue()
            );

        }

    });

    return {

        getValue() {

            return cm.getValue();

        },

        setValue(text) {

            const challenge =
                new URLSearchParams(location.search)
                    .get("challenge");

            //const saved = challenge? localStorage.getItem("editor_" + challenge): null;
            //cm.setValue(saved ?? text);
			cm.setValue(text);

        },

        focus() {

            cm.focus();

        },

        clearSave() {

            const challenge =
                new URLSearchParams(location.search)
                    .get("challenge");

            localStorage.removeItem(
                "editor_" + challenge
            );

        }

    };

})();
