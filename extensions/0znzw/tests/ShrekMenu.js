/**!
 * Shrek menu. (formely image menus)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function (Scratch) {
    const shrekJpeg = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAB8AOAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAFBgAEBwgCAf/EADEQAAEDAwIDBQcFAQAAAAAAAAECAwQFERIAIQYxQRNRYXGxBxQiMoGRoSOywdHxFf/EABkBAAMBAQEAAAAAAAAAAAAAAAIDBQQGAf/EACURAAEDBAECBwAAAAAAAAAAAAEAAhEDBBIhEzFxBSNBYZGh0f/aAAwDAQACEQMRAD8A05PFdEcSEpqUIEixyeSPXVebUIphyHadKiyX0tqLbaH0nJVthsdc6pqzybqUzew18NSW8sFuPioW5Hvv4+ehFV4BACZg1dA0PiRLtNeanMCPUm28lsvNqQCOihfmm+l9ziGU7KMd55C0oGRAjraxSeoubW576Bey5tD1Jqs6UFJSXQyQtWwASFH9w+2iL0uDS1SJBhz8pClOrefQpYVmbm3RN7DbbXP3l2+rUdRJJiOnqfdaGMAEoTK4rlSe2iR3W0tuHHLM5p8rj8emvNGls0piLEfmZz31JL7YfspJ8QD3WHdoey/FlSFtx1SGWDf9HcNn4gq4B63HPpy1UXxJIoNXlQUMN+7l0K7RAsuykhW9vmsT4apUK7g3jbOhPXaRgCdrRISpK5TSGFuOKUoXGRULX39fxqaWYtTenw0S4sthZJxKAFZJvyuMhbU00eKOZrH5J/ERtQdz9JEUwQnAgleFgAN1EWtb86t0qjrU68+XQEtDBxCh8RX3Dxvtp+9nUaCiYqpSUBTjCUiMCm/ZlQBJ87EAfXSotaqfKnAm6kTXHLjls4beg++vC4490YAy7J4RARwxwstLwDhyVJebTyJCQcB3j4QL9d+XLSMfadVnnD7xDiFIJ2Sg7eHza1OrMMVCGtl4ZNEBXmhQ/o6Rq1SqJ706qRHcck4pz7JzDIgfNbG17Wv3+GotpxGo9tw2XymkEgQUtxuJXatOLTsZtvtF5JU2nHE8+Vz0vqnxSjs6yt0jLNCVfi1vuNGW48ISEe4xkx20bgZZqv1UpRAufoBbpoHxUu1TabVfZkE/c/7qrRa3m8sahZnFSNTKgqkf9KC2taEKKVqZPxIAtuRzt5X1NOns9HZUMHK5W8pXLyH8amqXEw7S8yv/2Q==`;

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Image Menus" extension must be ran unsandboxed.`);
    }

    //utility code
    function modifyDropdown(blockId, dropdownNum, onclick) {
        let block = document.querySelector(
            `g.blocklyWorkspace g[data-id="${blockId}"]`,
        );
        let dropdown = block.querySelectorAll(
            'g[data-argument-type="dropdown"]',
        )[dropdownNum];
        // @ts-ignore
        dropdown.onmouseup = (e) => {
            onclick(e, dropdown);
        };
    }
    function watchBlock(id, dropdownNumber, finalMutate) {
        modifyDropdown(id, dropdownNumber, function (e, dropdown) {
            const callback = (mutationList, observer) => {
                const finalMutation = mutationList[mutationList.length - 1];
                if (
                    finalMutation.type == 'attributes' &&
                    finalMutation.target.classList.contains(
                        'blocklyDropdownMenu',
                    ) &&
                    finalMutation.attributeName == 'tabindex'
                ) {
                    finalMutate(finalMutation);
                }
                observer.disconnect();
            };
            const observer = new MutationObserver(callback);
            observer.observe(document.querySelector('div.blocklyDropDownDiv'), {
                attributes: true,
                childList: true,
                subtree: true,
            });
        });
    }
    function setItemText(itemHTML, newText) {
        let checkbox = false;
        if (
            itemHTML.includes(
                '<div class="goog-menuitem-checkbox" style="user-select: none;"></div>',
            )
        )
            checkbox = true;
        itemHTML = newText;
        if (checkbox)
            itemHTML = `<div class="goog-menuitem-checkbox" style="user-select: none;"></div>${itemHTML}`;
        return itemHTML;
    }

    function manageItems(callbackPerItem) {
        const contentDiv = document.querySelector('div.blocklyDropDownContent');
        const menuItems = contentDiv.querySelectorAll(
            'div.goog-menuitem div.goog-menuitem-content',
        );
        let itemHeights = 0;
        for (const item of menuItems) {
            item.innerHTML = setItemText(item.innerHTML, callbackPerItem(item));
            itemHeights += 32;
            //@ts-ignore
            item.style.height = '32px';
        }
        //@ts-ignore
        contentDiv.style.height = `${itemHeights + 32}px`;
    }

    //actual code
    function injectItems() {
        manageItems((item) => {
            //switch (item.innerText) {}
            return `<span><img src="${shrekJpeg}" height="15"></img></span>`;
        });
    }

    class extension {
        getInfo() {
            return {
                id: '0znzwShrekDropdowns',
                name: 'Shrek Dropdown',
                blocks: [
                    {
                        opcode: 'shrekMenu',
                        blockType: 'command',
                        text: 'shrek menu [shrek]',
                        arguments: {
                            shrek: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'shrek',
                            },
                        },
                        // this only works in vm's with the PR:
                        branchIcon: shrekJpeg
                    },
                ],
                menus: {
                    shrek: { items: ['shrek', 'is', 'cool'] },
                },
            };
        }
        shrekMenu() {
            alert('SHREK');
        }
    }

    const menus = new extension().getInfo().menus;
    let shrekIdentifier = menus.shrek.items.join('\n');

    function spawnUpdates() {
        setTimeout(() => {
            injectItems();
        }, 25);
    }

    function watchMenuedBlocks() {
        //watchBlock('Og[7WhydKecnYL;_j,*_', 0, () => {});
    }

    //@ts-ignore
    vm.runtime.on('PROJECT_CHANGED', spawnUpdates);
    //@ts-ignore
    vm.runtime.on('BLOCK_DRAG_UPDATE', spawnUpdates);
    //@ts-ignore
    vm.runtime.on('BLOCK_DRAG_END', spawnUpdates);

    function handleMutator(dropdownText) {
        if (dropdownText === shrekIdentifier) spawnUpdates();
    }

    const dropdownDiv_ = document.querySelector('div.blocklyDropDownDiv');
    const callback_ = (mutationList, observer) => {
        //@ts-ignore
        handleMutator(dropdownDiv_.innerText);
    };
    const observer_ = new MutationObserver(callback_);
    observer_.observe(dropdownDiv_, {
        attributes: true,
        childList: false,
        subtree: false,
    });

    //@ts-ignore
    Scratch.extensions.register(new extension());
})(Scratch);
