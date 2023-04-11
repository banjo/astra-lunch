import { sample } from "@banjoanton/utils";

const emojiMapper = {
    "🐟": ["fisk", "torsk", "fångst", "havets", "havs", "lax", "makrill", "sej", "kolja"],
    "🦀": ["räka", "hummer", "krabba", "kräfta", "kräftor", "kräftstjärtar", "skaldjur"],
    "🍔": ["hamburgare", "burgare", "hamburger", "cheeseburgare", "cheeseburger"],
    "🍖": ["kött", "fläskkarré", "schnitzel", "fläsk", "wallenbergare", "biff"],
    "🍗": ["kyckling", "höna", "wings"],
    "🍕": ["pizza", "margherita", "pepperoni", "vesuvio"],
    "🍟": ["pommes", "pommes frites"],
    "🥓": ["bacon", "fläsk"],
    "🍤": ["räkor", "räkcocktail", "räka"],
    "🌭": ["korv", "salsiccia", "hot dog", "frankfurter"],
    "🌮": ["taco", "burrito"],
    "🍲": ["soppa", "soppsbuffe", "soppsbuffé"],
    "🍝": ["pasta", "spaghetti", "lasagne", "fettuccine", "linguine"],
    "🥧": ["paj"],
    "🍄": ["svamp", "champinjon", "karl-johan"],
    "🥔": [
        "potatis",
        "potatisar",
        "potatismos",
        "mosad potatis",
        "klyftpotatis",
        "potatisgratäng",
        "mos",
        "potatischips",
    ],
    "🍞": ["bröd", "brödskiva", "smörgås", "smörgåsbröd"],
    "🍜": ["nudlar", "ramen", "udon", "soba", "pho"],
    "🍣": ["sushi", "maki", "nigiri", "sashimi", "california roll"],
    "🍱": ["bento", "bento-låda", "japansk lunchlåda", "sushi bento", "tempura bento"],
    "🥗": ["sallad", "grönsallad", "caesarsallad", "pastasallad", "potatissallad"],
    "🍛": ["curry", "kurry"],
    "🍚": ["ris", "basmatiris", "jasminris"],
    "🥘": ["gryta", "köttgryta", "vegansk gryta", "fiskgryta", "kycklinggryta"],
    "🍳": ["ägg"],
    "🥞": ["pannkakor", "pannkaka", "pannkaks"],
    "🔥": ["bränd", "brända", "bränt"],
    "🍦": ["glass"],
    "🍩": ["donut"],
    "🍪": ["kaka", "kex", "efterrätt", "fika", "dessert"],
    "🍫": ["choklad", "kakao"],
    "🇮🇳": ["indiskt"],
    "🇯🇵": ["japanskt"],
    "🇹🇭": ["thai"],
};

const generalFoodEmojis = ["👨‍🍳", "🍽", "🍴", "👩‍🍳", "🍳"];

const getLunchEmojis = (lunch: string, amount = 3): string => {
    lunch = lunch.toLowerCase();
    let emojis = "";

    for (const emoji in emojiMapper) {
        const keywords = emojiMapper[emoji];

        for (const keyword of keywords) {
            if (emojis.length === amount * 2) {
                return emojis;
            }

            if (lunch.includes(keyword.toLowerCase())) {
                if (emojis.includes(emoji)) {
                    continue;
                }

                emojis += emoji;
            }
        }
    }

    while (emojis.length < amount * 2) {
        const emojisNotUsed = generalFoodEmojis.filter(emoji => !emojis.includes(emoji));

        if (emojisNotUsed.length === 0) {
            break;
        }

        emojis += sample(emojisNotUsed);
    }

    return emojis;
};

export const EmojiService = {
    getLunchEmojis,
};
