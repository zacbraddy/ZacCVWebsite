'use client';

import { useEffect } from 'react';

const CYAN = '#04b4e0';
const DIM = '#9a9da1';

const BACKROOM_URL = 'https://zackerthehacker.com/backroom';
const REPO_URL = 'https://github.com/zacbraddy/ZacCVWebsite';

const bubble = String.raw`   .------------------------------------------.
   | Ah, I see you're also a tech wizard.     |
   | Well, while you're here, you may         |
   | as well come in! <3                      |
   '------------------------------------------'
        \
         \
`;

const wizard = String.raw`                    ____
                  .'* *.'
               __/_*_*(_
              / _______ \
             _\_)/___\(_/_
            / _((\- -/))_ \
            \ \())(-)(()/ /
             ' \(((()))/ '
            / ' \)).))/ ' \
           / _ \ - | - /_  \
          (   ( .;''';. .'  )
          _\"__ /    )\ __"/_
            \/  \   ' /  \/
             .'  '...' ' )
              / /  |  \ \
             / .   .   . \
            /   .     .   \
           /   /   |   \   \
         .'   /    b    '.  '.
     _.-'    /     Bb     '-. '-._
 _.-'       |      BBb       '-.  '-.
(________mrf\____.dBBBb.________)____)`;

const links = `  → The backroom   ${BACKROOM_URL}
                   how this site was actually built

  → The source     ${REPO_URL}
                   for when you just wanna see the code!`;

let emitted = false;

const ConsoleEgg = () => {
  useEffect(() => {
    if (emitted) return;
    emitted = true;

    console.log(`${bubble}\n%c${wizard}`, `color:${CYAN}`);
    console.log(`%c${links}`, `color:${DIM}`);
  }, []);

  return null;
};

export default ConsoleEgg;
