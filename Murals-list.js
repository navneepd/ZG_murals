// Mural-list.js - Contains mural data and helper functions

// Convert DMS to Decimal Degrees or pass through if already decimal
function dmsToDecimal(dms) {
    // If it's already a number (decimal format), return it directly
    if (typeof dms === 'number') {
        return dms;
    }

    if (!dms || dms.trim() === '') return null;

    // Check if it's already a decimal number (string format like "26.75174597")
    const decimalValue = parseFloat(dms);
    if (!isNaN(decimalValue) && dms.toString().indexOf('°') === -1) {
        return decimalValue;
    }

    // Remove any extra spaces and split the string (DMS format)
    const cleanDms = dms.replace(/\s+/g, '');
    const parts = cleanDms.split(/[°'"]/).filter(part => part.trim() !== '');

    if (parts.length < 4) return null;

    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    const direction = parts[3].trim();

    let decimal = degrees + minutes / 60 + seconds / 3600;

    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }

    return decimal;
}

// Mural data from the Excel file
const muralData = [
    {
        name: "Zubeen Da's Blessing",
        lat: "26° 8'34.88\"N",
        lng: "91°47'37.03\"E",
        locationDesc: "Dispur (Guwahati) - Flyover I opposite National Bank For Agriculture & Rural Development",
        description: "The unforgettable connection between Zubeen Da and his fans, painted for all to see. His music is his gift, and his outstretched arm is a benediction over his Fans. A gorgeous tribute to the legend who gave his heart to the people.",
        artist: "Neelim Mahanta and Team",
        status: "Marked",
        images: ["Dispur_mural_1.jpg", "Dispur_mural_2.jpg"]
    },
    {
        name: "মন যায় mural",
        lat: "27°16'22.69\"N",
        lng: "94° 5'15.52\"E",
        locationDesc: "North Laximpur bypass road",
        description: "This incredible mural captures Zubeen Da in his free-spirited, bohemian style. Right beside his compelling gaze is the iconic phrase 'মই জাই' (Mon Jaai),It's a powerful symbol of the voice that speaks for the heart and the restless, rebellious spirit that defines Zubeen Da's enduring legacy in Assam. মন যায়-forever in our hearts.",
        artist: "Neelim Mahanta",
        status: "Marked",
        images: ["North_Lakhimpur.png"]
    },
    {
        name: "The Voice of the Brahmaputra",
        lat: "27°41'1.02\"N",
        lng: "94°48'33.80\"E",
        locationDesc: "L.M.T. Sr. Secondary SCHOOL, DIMOW College Road, Chariali, Dimow, Dhemaji District, Assam",
        description: "This exquisite artwork is a vibrant tribute to Zubeen Da's connection to his land. He is pictured wearing a traditional Jaapi (Assamese conical hat) and singing passionately, with a collage of Assam's seasonal landscapes forming the background. It celebrates him as the true voice of the state's nature and culture.",
        artist: "mino_patir,Ruhiteswar_Moran, Gobin_Taye & na.kull",
        status: "Marked",
        images: ["Mino_dhemaji mural.png"]
    },
    {
        name: "The Humming King Mural",
        lat: "26°45'13.85\"N",
        lng: "94°12'25.38\"E",
        locationDesc: "Gandi park-Jorhat",
        description: "Unveiled mural honoring Zubeen Da",
        artist: "Snigdho_Junak & abhinayan_boruah",
        status: "Marked",
        images: ["Gandhi park.jpg"]
    },
    {
        name: "Jorhat stadium Murals",
        lat: "26°45'18.42\"N",
        lng: "94°12'21.99\"E",
        locationDesc: "Outside wall of the stadium, Jorhat",
        description: "Various artists came together to paint heartfelt murals in memory of Zubeen Da, celebrating his music, spirit, and legacy",
        artist: "snigdho & various artist(Reach out to me for credits)",
        status: "Marked",
        images: ["jorhat stadium.jpg"]
    },
    {
        name: "OG মন যায়",
        lat: "26° 8'30.58\"N",
        lng: "91°39'31.44\"E",
        locationDesc: "Assam Engineering College: Hostel-1",
        description: "A vibrant mural at Assam Engineering College pays tribute to Zubeen Garg and the classic film মন যায় shot on its campus.",
        artist: "Reachout for credit",
        status: "Marked",
        images: ["AEC guwahti.jpg"]
    },
    {
        name: "সাগৰৰ দৰে গভীৰ Mural",
        lat: "26°39'5.76\"N",
        lng: "92°49'27.55\"E",
        locationDesc: "Dolabari flyover: Tezpur",
        description: "A mesmerizing mural of Zubeen Da singing in the depths of the ocean, symbolizing how his voice flows endlessly like waves. It reflects the depth of his music timeless, soulful, and boundless like the ocean itself.",
        artist: "Runal & team",
        status: "Marked",
        images: ["dolobari.png"]
    },
    {
        name: "Rockstar Zubeen da",
        lat: "27°28'28.28\"N",
        lng: "94°56'30.71\"E",
        locationDesc: "Dibrugarh Convoy Road",
        description: "A direct translation of his soul onto the wall. This mural shows Zubeen Da in his element guitar in hand and mic to his lips, a true rockstar whose music and spirit have weathered every storm. Forever our anthem",
        artist: "Chitli & team",
        status: "Marked",
        images: ["Dibrugarh_Mural.png"]
    },
    {
        name: "Zubeen Da Caricature",
        lat: "26°59'11.31\"N",
        lng: "94°38'11.11\"E",
        locationDesc: "Lahoty Petrol Pump in Sivasagar",
        description: "A vibrant caricature of Zubeen Garg, capturing his rockstar energy and soulful Assamese spirit. His expressive charm reflects the heartbeat of Assam through music and passion",
        artist: "Navajit Changmai",
        status: "Marked",
        images: ["Lahoty_petrolpump.jpg"]
    },
    {
        name: "Zubeen Da Mural",
        lat: "27°14'10.80\"N",
        lng: "94° 6'0.40\"E",
        locationDesc: "thana road near khorika restaurant north lakhimpur word number 8",
        description: "A soulful mural of Zubeen Da featuring the lyrics of his beloved song “Mayabini,” the tune he wished to be played when he will not be among us.",
        artist: "Daniel Zorian",
        status: "Marked",
        images: ["mural_Daniel_Zorian.png"]
    },
    {
        name: "Colonel Zubeen Da 2",
        lat: "26°20'56.12\"N",
        lng: "90°39'9.37\"E",
        locationDesc: "Inside Ghorua Juti Hote",
        description: "A bold and dynamic mural of Colonel Zubeen Da, capturing his larger-than-life persona and commanding presence.",
        artist: "Reachout for credit",
        status: "Marked",
        images: ["Ghorua_Juti_Hotel_Mural.png"]
    },
    {
        name: "Rockstar Zubeen Da 2",
        lat: "27°32'35.68\"N",
        lng: "94°15'21.77\"E",
        locationDesc: "NHPC, Gogamukh: Gupta bridge",
        description: "The artwork celebrates his fearless spirit, musical legacy, and the enduring impact he has left on fans and culture alike.",
        artist: "Mino_patir",
        status: "Marked",
        images: ["Gogamukh_Mural.png"]
    },
    {
        name: "Mayabini Mural",
        lat: "27°13'55.25\"N",
        lng: "94° 5'44.37\"E",
        locationDesc: "Lakhimpur Girl's College",
        description: "A vibrant mural of Zubeen Da set against the backdrop of Assam’s map, symbolizing his deep roots and everlasting connection to his homeland",
        artist: "Reachout for credit",
        status: "Marked",
        images: ["Lakhimpur_Girls_ College.png"]
    },
    {
        name: "The Stairway to heaven: Zubeen da Mural ",
        lat: "27° 7'38.71\"N",
        lng: "94°44'23.90\"E",
        locationDesc: "Demow bypass NH-37",
        description: "On a staircase of keys, Zubeen Da walks to the skies, his music lifting souls where eternity lies",
        artist: "Reachout for credit",
        status: "Marked",
        images: ["Demow_mural.jpg"]
    },
    {
        name: "The rebel with a mic",
        lat: "26°57'12.83\"N",
        lng: "94°34'22.63\"E",
        locationDesc: "Joysagar Bustand",
        description: "His voice echoes through the concrete",
        artist: "Mohibul",
        status: "Marked",
        images: ["Joysagar_Bustand_mural.jpg", "Joysagar_Bustand_mural(2).jpg"]
    },
    {
        name: "The Starry Night: Zubeen da Mural",
        lat: "25°59'5.16\"N",
        lng: "90°46'17.95\"E",
        locationDesc: "Dudhnoi: Guwahati-Goalpara Road",
        description: "Passion, poetry, and performance. This surreal mural perfectly captures the magnetic aura of Zubeen Da",
        artist: "Himdipta kakati",
        status: "Marked",
        images: ["Dudhnoi_mural_1.jpg", "Dudhnoi mural_2.jpg"]
    },
    {
        name: "Zubeen da and His ডটোৰাই”",
        lat: "26° 8'30.12\"N",
        lng: "91°47'12.31\"E",
        locationDesc: "Rajdhani Masjid Circle",
        description: "তেওঁৰ ডটোৰাই গোধূলিত মায়াবিনী গুণগুণায়,আৰু প্ৰতিটো প্ৰভাতত জিয়া ৰে কাণত কাণে কয় এটা গান,যাৰ অন্ত নাই।",
        artist: "Imam Ali",
        status: "Marked",
        images: ["Imam_ali.jpg", "Imam_ali_2.jpg"]
    },
    {
        name: "The Gaze of the Bard: Zubeen Da",
        lat: "26° 9'24.43\"N",
        lng: "91°39'55.20\"E",
        locationDesc: "Guwahati University Market",
        description: "Against the striking canvas, Zubeen Da's intense spirit is immortalized alongside the evocative মায়াবিনী ৰাতিৰ বুকুত। In this silent tribute, his unspoken promise resonates: নিজানৰ গান মোৰ শেষ হ’ব ভাবোঁ তোমাৰ বুকুত। A testament to a voice that forever resides in countless hearts.",
        artist: "Kapil Das & Team",
        status: "Marked",
        images: ["GU_market.jpg"]
    },
    {
        name: "The Discography Wall",
        lat: "26° 9'14.42\"N",
        lng: "91°39'54.72\"E",
        locationDesc: "Guwahati University: BT Camopus",
        description: "a visual playlist of the heartbeat of Assam. This wall is a tapestry woven from the threads of his music.",
        artist: "Kapil Das",
        status: "Marked",
        images: ["Bt campus, Guwahati uni.png"]
    },
    {
        name: "The Canvas of Rebellion",
        lat: "26°25'36.38\"N",
        lng: "91°36'53.38\"E",
        locationDesc: "Rangia college",
        description: "a swirling constellation of lyrics and album names. Stand as stark banners, reflecting the singer's twin loves: music's gentle soul and the fearless, outspoken spirit that gave voice to his people.",
        artist: "Kapil Das & Shankar Sharma",
        status: "Marked",
        images: ["rangia college.jpg"]
    },
    {
        name: "পপীয়া তৰা: The Guiding Star",
        lat: "26°25'47.38\"N",
        lng: "91°37'39.76\"E",
        locationDesc: "Rangia Bypass Flyover",
        description: "The soul of the star who never forgot the soil. Donning his signature hat and a turquoise bead necklace, Zubeen Da emerges from a fiery, earth-toned backdrop. The inscription beside him whispers a line of eternal affection: তুমি যেন পপীয়া তৰা (You are like a guiding star).",
        artist: "Ojantric",
        status: "Marked",
        images: ["Rangia flyover.jpg"]
    },
    {
        name: "Rock-Bahi:The Blue Rhapsody",
        lat: "26°25'45.87\"N",
        lng: "91°37'40.52\"E",
        locationDesc: "Rangia Bypass Flyover",
        description: "Against a deep, nocturnal blue, the youthful rocker stands- the rebel poet with his keyboard. The wind of his music sweeps across the wall, carrying lines of lyrics that speak to the heart of every Assamese",
        artist: "Ojantric",
        status: "Marked",
        images: ["Rangia mural.jpg"]
    },
    {
        name: "The King's Gaze",
        lat: "26°50'56.23\"N",
        lng: "94°29'39.07\"E",
        locationDesc: "Jhanji-Jamuguri Road, Jorhat",
        description: "The flyover walls are alive with the charismatic gaze and golden shine of Zubeen Da.",
        artist: "Dhruvajyoti_Dutta & Mousum_Gogoi",
        status: "Marked",
        images: ["Janji_Mural_3.jpg"]
    },
    {
        name: "The Heartbeat of the Stage",
        lat: "26°50'56.84\"N",
        lng: "94°29'39.36\"E",
        locationDesc: "Jhanji-Jamuguri Road",
        description: "This mural captures the quintessential rock star performer. Zubeen Da is shown in a casual hat and t-shirt, smiling warmly into the microphone, embodying the energy and personal connection he shared with his audience at every live show",
        artist: "Satyajit_Boruah",
        status: "Marked",
        images: ["Janji_Mural_2.jpg"]
    },
    {
        name: "Axom's Charisma",
        lat: "26°50'55.75\"N",
        lng: "94°29'38.94\"E",
        locationDesc: "Jhanji-Jamuguri Road",
        description: "A bold, larger-than-life portrait showing Zubeen Da's dramatic flair",
        artist: "Gyan_Deep_Barman",
        status: "Marked",
        images: ["Janji_Mural_1.jpg"]
    },
    {
        name: "Poetry of the Soul Mural",
        lat: "26°15'3.50\"N",
        lng: "92°20'27.07\"E",
        locationDesc: "Bihutoli Morigaon",
        description: "Eternal light, eternal tune Zubeen da",
        artist: "Wingmon",
        status: "Marked",
        images: ["Morigaon mural(1).jpg", "Morigaon mural.jpg"]
    },
    {
        name: "The Smiling Rebel",
        lat: "26°11'12.60\"N",
        lng: "91°44'58.27\"E",
        locationDesc: "Cotton University: SNBC Hostel",
        description: "A smile that lights the darkness, a voice that calms the storm. His spirit, painted bright against the yellow of hope, lives here forever.",
        artist: "Marcel",
        status: "Marked",
        images: ["SNBC_hostel.jpg"]
    },
    {
        name: "The Unforgettable Gaze",
        lat: "26°11'16.20\"N",
        lng: "91°44'57.70\"E",
        locationDesc: "Cotton University: RKB Hostel",
        description: "An intense portrait of a younger Zubeen Da, featuring his trademark wild hair and a piercing, unforgettable gaze. The expressive, rough brushwork captures the raw passion and energetic spirit of the legendary Zubeen Da.",
        artist: "Reachout for credit",
        status: "Marked",
        images: ["RKB_hostel.jpg"]
    },
    {
        name: "Long hair Zubeen Da Mural",
        lat: "26° 8'34.34\"N",
        lng: "91°47'37.19\"E",
        locationDesc: "Dispur (Guwahati) - Flyover I opposite National Bank For Agriculture & Rural Development",
        description: "Captured in monochrome, the timeless charisma of Zubeen Da . This mural perfectly represents the prime era of Zubeen Da, reminding us why he is the undisputed voice and style icon for millions. Iconic and unshakeable.",
        artist: "Lukmon Ron",
        status: "Marked",
        images: ["Dispur_mural_3.jpg", "Dispur_mural_4.jpg"]
    },
    {
        name: "Colonel Zubeen Da",
        lat: "26°54'37.80\"N",
        lng: "94°44'12.15\"E",
        locationDesc: "Dikhow RailwayBridge Pillars)",
        description: "Capturing the charisma of Colonel Zubeen Da, one stroke at a time. The street as a canvas for our legend.",
        artist: "Ankush Nath",
        status: "Marked",
        images: ["Dikhow-railBridge-pillars.jpg"]
    },
    {
        name: "Baidew Hotel Mural",
        lat: 26.75174597,
        lng: 93.13431237,
        locationDesc: "Baidew Hotel Bishwanath bypass",
        description: "Located in a place of daily community interaction, this piece transforms a simple wall into a cherished spot. It doesn't rely on academic perfection; it relies on collective love. This mural serves as a constant, affectionate reminder of Zubeen Da's place in our hearts, proving that the deepest connections are often formed by passion, not polish. It is special simply because it is for him.",
        artist: "Tridip",
        status: "Marked",
        images: ["Baidew_hotel_mural.jpg"]
    },
    {
        name: "The Underpass Serenade",
        lat: 26.11938769,
        lng: 91.82211187,
        locationDesc: "Khanapara Underpass",
        description: "In a city defined by its constant motion, this mural acts as a vibrant, inescapable pause. It turns the anonymous underpass into a spontaneous and public shrine. It is a daily tribute by the community to a musician whose voice has been the soundtrack to generations, symbolizing the enduring power of art and culture to thrive even in the most functional, industrial corners of the city.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Khanapara_mural.jpg", "Khanapara_mural1.jpg"]
    },
    {
        name: "Be Rebel mural",
        lat: 26.17941834,
        lng: 91.75908985,
        locationDesc: "B. Borooah Hostel Wall",
        description: "Fueling the next generation of revolutionaries. Zubeen Da takes center stage at B. Borooah College.",
        artist: "Marcel Baruah",
        status: "Marked",
        images: ["B.Borooah_mural1.jpg", "B.Borooah_mural.jpg"]
    },
    {
        name: "The Eternal Echo Mural",
        lat: 26.15038485,
        lng: 91.78503225,
        locationDesc: "Beneath the Ganesguri Flyover",
        description: "Beneath the roar of the Ganesguri Flyover, this iconic mural stands as a silent vow. Zubeen Da our 'Comrade,' is captured with an eternal gaze behind his sunglasses, his image bathed in the light of a perpetual sunburst a symbol of the hope he ignited. The powerful declaration, \"COMRADE NEVER DIE,\" isn't just graffiti; it is the collective, heart-felt promise of his fans that the spirit of the rebel, the poet, and the legend lives on, always watching over the city he loved.",
        artist: "LYKO",
        status: "Marked",
        images: ["Comrade_zubeen_da.jpg"]
    },
    {
        name: "The Enchanting Voice Mural",
        lat: 26.18519368,
        lng: 91.73933323,
        locationDesc: "Opposite Guwahati Rajaduwar Ferry Service",
        description: "Situated on a busy roadside wall, the Mayabini mural transforms the concrete barrier into an open-air canvas of adoration. Framed by a simple metal fence like a stage, this arresting tribute breaks through the urban chaos, offering a moment of profound cultural pride and reminding every passerby of Zubeen Da's enduring, mystical charm.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Guwahati_port1.jpg", "Guwahati_port2.jpg"]
    },
    {
        name: "Goldie da Mural",
        lat: 26.1849927,
        lng: 91.73916023,
        locationDesc: "Opposite Guwahati Rajaduwar Ferry Service",
        description: "A dual-image mural featuring two representations of Zubeen Da. The left side is a silhouette in warm tones, arm raised high in rockstar triumph, labeled \"Goldie da\" (his nickname). The right side is a more realistic, emotional portrayal of him singing, with colors split between dark and vibrant hues. This mural captures both the energetic performer and the pensive vibe of Zubeen Da",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Guwahati_port3.jpg", "Guwahati_port4.jpg"]
    },
    {
        name: "Hat and High Notes",
        lat: 26.18481218,
        lng: 91.7389765,
        locationDesc: "Opposite Guwahati Rajaduwar Ferry Service",
        description: "A striking portrait capturing the intensity of Zubeen Da's live performance. He is depicted in a wide-brimmed hat, leaning into the mic amidst rich, warm colors. The prominent Assamese lyric, \"গান গোৱা\" (Gaan gua), serves as a direct call to the viewer to \"Remember his Songs\" and the emotions it carries.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Guwahati_port5.jpg"]
    },
    {
        name: "Zubeen Da Wave Rider",
        lat: 26.18488127,
        lng: 91.73908603,
        locationDesc: "Opposite Guwahati Rajaduwar Ferry Service",
        description: "A dramatic, side-profile portrait of Zubeen Da, wearing sunglasses and featuring his signature long, flowing hair painted against a vivid blue background. The figure is surrounded by stylized white waves or swirling energy, emphasizing his rockstar persona and connection to the waves.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Guwahati_port6.jpg", "Guwahati_port7.jpg"]
    },
    {
        name: "Voice on the Wall Mural",
        lat: 26.08857409,
        lng: 89.9633975,
        locationDesc: "boundary wall of the Gauripur Public Library",
        description: "See the 'Voice on the Wall.' A massive, unforgettable 12x15 ft mural celebrating Zubeen Da's life and legacy, painted with passion by Gauripur's finest local artists. A must-see cultural landmark.",
        artist: "Bishnu Prasad Ray, Kalyani Adhikary, Nabajyoti Barman, Hemanta Ray, Tanmay Roy, Nayan Roy",
        status: "Marked",
        images: ["Gauripur_mural.jpg"]
    },
    {
        name: "Che Guevara of Assam: The Rebel Mic",
        lat: 26.20022558,
        lng: 91.77845806,
        locationDesc: "Outside wall of Lighthouse Towers",
        description: "A powerful, high-contrast mural celebrating Zubeen Da's dual identity as a musical icon and a social revolutionary (\"Comrade Zubeen\"). Depicted in military-style attire, the artist holds a microphone labeled 'ZUBEEN' as a symbol of resistance, the artwork is a potent tribute to his unwavering spirit of defiance.",
        artist: "Pankaj pao, Dhritismita talukdar, Sumit Sarkar, Irean Ansari, Kalpa Jyoti Das, hrishikesh Das, Thinshu Gogoi",
        status: "Marked",
        images: ["Lighthouse_mural1.jpg", "Lighthouse_mural.jpg"]
    },
    {
        name: "The Romantic Rebel",
        lat: 26.20035629,
        lng: 91.77909321,
        locationDesc: "Opposite bhakti kuthir",
        description: "A romantic and expressive portrait of Zubeen Da, focusing on his identity as a young musical poet. Featuring his signature long hair, the mural is surrounded by floating musical notes and song lyrics, and is titled 'Mayabini' (Enchanting), celebrating the emotional depth of his melodies and lyrics.",
        artist: "tridip_arts, ms.pigments, ujaswata, zumon___, _akshayyyy.yy, rahul_thakuria",
        status: "Marked",
        images: ["Bhakti_kutir_mural.jpg"]
    },
    {
        name: "The Sound and the Sanctuary Mural",
        lat: 26.13760131,
        lng: 91.80871023,
        locationDesc: "Triveni path: Six mile",
        description: "Here is a vibrant, multi-panel street art tribute to Zubeen Da, celebrating his multifaceted persona and enduring legacy. It combines realistic portraiture with energetic graffiti and symbolic elements over a continuous stretch of wall.",
        artist: "Neelim Mahanta",
        status: "Marked",
        images: ["Triveni_path_mural1.jpg", "Triveni_path_mural.jpg"]
    },
    {
        name: "The Smiling Poet mural",
        lat: 26.12086536,
        lng: 91.54067728,
        locationDesc: "Palasbari market",
        description: "A beautifully cheerful mural of Zubeen Da featuring his wide, engaging smile against a vibrant, abstract backdrop. The artwork is dominated by a profound lyrical quote expressing his desire to embrace the sky within his heart and find peace in the depth of the ocean. This piece celebrates Zubeen Da's emotional complexity, portraying him as a poet caught between the boundless vastness of the heavens and the silent mystery of the deep.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["Palasbari_mural.jpg", "Palasbari_mural1.jpg"]
    },
    {
        name: "The Eternal Bard",
        lat: 26.14005966,
        lng: 91.79744286,
        locationDesc: "Dispur flyover 1, opp. Vishal Mega Mart",
        description: "A striking portrait on a flyover wall, depicting Zubeen Da with a pensive expression, holding a guitar and draped in a traditional gamusa. This artwork, marked '1972–∞', beautifully symbolizes his eternal legacy and his unique fusion of rock music with Assamese cultural heritage.",
        artist: "Testsketcher",
        status: "Marked",
        images: ["Testsketcher_mural.jpg"]
    },
    {
        name: "The Fedora and The Roses Mural",
        lat: 26.12964083,
        lng: 91.80639329,
        locationDesc: "D' BACKYARD TREE CAFÉ",
        description: "A grand, intimate mural adorning the wall of a cafe. The artwork features a stunning dual portrait: the powerful, fedora wearing rockstar singing into the mic, juxtaposed with a softer, youthful portrait. Framed by rich red roses and a dark, moody atmosphere, this mural captures the two sides of Zubeen Da's artistry - the passionate performer and the soulful poet creating a perfect ambiance for a lyrical lounge.",
        artist: "Reach out for credit",
        status: "Marked",
        images: ["D'backyard_cafe.jpg"]
    },
    {
        name: "Joi Zubeen Da Mural",
        lat: 26.15263745,
        lng: 91.78443283,
        locationDesc: "Hotel Kamrupa",
        description: "A bright, celebratory mural featuring Zubeen Da with an infectious smile and a traditional blue Assamese paga. Painted in vivid yellow and green, the artwork is crowned with the phrase \"জয় জুবিন দা\" (Joi Zubeen Da), serving as a powerful, Cultural Shrine of affection and respect for the beloved artist.",
        artist: "Gautam Das",
        status: "Marked",
        images: ["Sinha_lodge.jpg"]
    },
];

// Function to determine marker color based on location
function getMarkerColor(locationDesc) {
    if (!locationDesc) return '#2ecc71'; // Green for other locations

    const desc = locationDesc.toLowerCase();
    if (desc.includes('guwahati') || desc.includes('dispur')) {
        return '#e74c3c'; // Red for major cities
    } else if (desc.includes('nazira') || desc.includes('sivasagar') ||
        desc.includes('lakhimpur') || desc.includes('jorhat') ||
        desc.includes('morigaon') || desc.includes('dhemaji') ||
        desc.includes('dibrugarh') || desc.includes('north laximpur')) {
        return '#3498db'; // Blue for towns/villages
    } else {
        return '#2ecc71'; // Green for other locations
    }
}

// Calculate statistics
function calculateStats() {
    const totalMurals = muralData.length;

    // Count unique cities/towns
    const locations = muralData.map(mural => {
        if (!mural.locationDesc) return 'Unknown';
        const desc = mural.locationDesc.toLowerCase();
        if (desc.includes('guwahati') || desc.includes('dispur')) return 'Guwahati';
        if (desc.includes('nazira')) return 'Nazira';
        if (desc.includes('sivasagar')) return 'Sivasagar';
        if (desc.includes('lakhimpur')) return 'Lakhimpur';
        if (desc.includes('jorhat')) return 'Jorhat';
        if (desc.includes('morigaon')) return 'Morigaon';
        if (desc.includes('dhemaji')) return 'Dhemaji';
        if (desc.includes('dibrugarh')) return 'Dibrugarh';
        return 'Other';
    });
    const uniqueLocations = new Set(locations);
    const citiesCount = uniqueLocations.size;

    // Count artists (excluding empty strings)
    const artists = muralData.map(mural => mural.artist).filter(artist => artist && artist.trim() !== '');
    const uniqueArtists = new Set(artists);
    const artistsCount = uniqueArtists.size;

    // Count total images
    const imagesCount = muralData.reduce((total, mural) => total + mural.images.length, 0);

    return {
        totalMurals,
        citiesCount,
        artistsCount,
        imagesCount
    };
}

// Function to clean image file names
function cleanImageFileName(fileName) {
    return fileName
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s+\./g, '.') // Remove spaces before file extension
        .trim();
}

// Function to create image display HTML
function createImageDisplay(images, muralName) {
    if (!images || images.length === 0) {
        return '<p><em>No images available</em></p>';
    }

    let html = '<div class="popup-images"><strong>Images:</strong><div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">';

    images.forEach(img => {
        const cleanImg = cleanImageFileName(img);
        // Use local images from the images folder
        const imageUrl = `Images/${cleanImg}`;

        html += `
            <div style="flex: 1; min-width: 120px; text-align: center;">
                <img src="${imageUrl}" alt="${muralName}" class="image-thumbnail">
                <div class="image-filename">${cleanImg}</div>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}
