// Shared content for the dedicated destination pages (src/pages/DestinationPage.jsx)
// and the homepage destination grid (src/components/Destinations.jsx).
//
// Each entry has genuinely distinct copy per destination and per language —
// not a template with swapped nouns — so these read as real pages to both
// visitors and search engines rather than thin/duplicate content.

export const destinations = {
  en: [
    {
      id: 'airport',
      name: 'Athens Airport',
      tag: 'Airport Transfer',
      wide: true,
      price: '€50',
      duration: '~40 min',
      cardDesc: 'Fast, reliable rides to and from Athens International Airport. We monitor your flight and wait if you\'re delayed.',
      intro: 'Athens International Airport (ATH) sits roughly 35km east of the city centre, and getting the timing right matters more here than on almost any other transfer we run. Our airport service tracks your flight number in real time, so a delayed landing never means a driver who\'s already left. Whether you\'re catching an early return flight or arriving after a long-haul journey, you\'ll be met with a fixed, pre-agreed price — no meter, no surcharges for luggage, and no guessing what the ride will cost before you\'ve even landed.',
      highlights: [
        { icon: '✈️', title: 'Flight monitoring', desc: 'We track your flight and adjust automatically to delays, at no extra charge.' },
        { icon: '💶', title: 'Fixed price', desc: 'One agreed price, door to door — no meter running, no surprises.' },
        { icon: '🪧', title: 'Meet & greet', desc: 'Optional name-board pickup right at arrivals.' },
        { icon: '🧳', title: 'No luggage fees', desc: 'Standard luggage is included in the price, always.' }
      ],
      faq: [
        { q: 'How early should I book an airport pickup?', a: 'A day or two ahead is usually enough, but for early morning or peak-season slots we\'d recommend booking as soon as you have your flight details.' },
        { q: 'What happens if my flight is delayed?', a: 'We track your flight number directly, so your driver adjusts pickup time automatically — you won\'t be charged extra for a late landing.' },
        { q: 'Do you charge extra for luggage?', a: 'No. Standard luggage for the number of passengers booked is included in the fixed price.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Athens City Centre',
      photos: ['/destinations/airport-1.jpg', '/destinations/airport-2.jpg', '/destinations/airport-3.jpg'],
      alt: 'Athens International Airport taxi transfer with MO Transfers4all'
    },
    {
      id: 'meteora',
      name: 'Meteora',
      tag: 'Day Trip',
      price: '€425',
      duration: '~4.5 hrs',
      cardDesc: 'Ancient monasteries perched on towering rocks — one of Greece\'s most extraordinary sights.',
      intro: 'Meteora is one of the most photographed places in Greece for a reason: six Eastern Orthodox monasteries built directly into towering sandstone pillars, some dating back to the 14th century. It\'s a long day — about 4.5 hours each way from Athens — which is exactly why most visitors prefer a private transfer over public transport or a rushed group tour. You set the pace, stop where you like along the way, and travel in a private taxi or van rather than a coach full of strangers.',
      highlights: [
        { icon: '🚐', title: 'Private transfer', desc: 'Just your group, not a shared coach tour.' },
        { icon: '🛑', title: 'Flexible stops', desc: 'Ask to stop for photos or a break anywhere along the route.' },
        { icon: '🌙', title: 'Day trip or overnight', desc: 'Return same day, or we can arrange a multi-day trip.' },
        { icon: '⏱️', title: 'Driver waits', desc: 'Your driver waits on-site while you explore the monasteries.' }
      ],
      faq: [
        { q: 'Can we do Meteora as a day trip from Athens?', a: 'Yes, though it\'s a full day — roughly 9 hours round trip including time at the monasteries. Many visitors prefer an overnight stay to see it properly.' },
        { q: 'Is it better to stay overnight?', a: 'If you want to catch sunrise or sunset at the monasteries without rushing, an overnight stay in nearby Kalabaka is worth it — we can still handle both legs of the transfer.' },
        { q: 'What should I wear to visit the monasteries?', a: 'Modest dress is required: covered shoulders, and long trousers or a skirt below the knee for everyone. Wraps are sometimes available on-site but it\'s safer to bring your own.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Meteora, Kalabaka',
      photos: ['/destinations/meteora-1.jpg', '/destinations/meteora-2.jpg', '/destinations/meteora-3.jpg'],
      alt: 'Meteora monasteries taxi day trip from Athens'
    },
    {
      id: 'sounio',
      name: 'Cape Sounio',
      tag: 'Half-Day / Sunset',
      price: '€61',
      duration: '~45 min',
      cardDesc: 'Temple of Poseidon at sunset. A 45-minute drive from Athens along the Attic Riviera.',
      intro: 'Cape Sounio sits at the southern tip of Attica, about 70km from central Athens, where the Temple of Poseidon has watched over the Aegean since the 5th century BC. It\'s the easiest of our destination transfers — around 45 minutes along the coastal road — which makes it a natural half-day or sunset trip rather than a full expedition. Many clients time the pickup for late afternoon so they arrive right as the light turns gold over the temple columns.',
      highlights: [
        { icon: '🌅', title: 'Scenic coastal drive', desc: 'Just 45 minutes along the Attic Riviera.' },
        { icon: '🌇', title: 'Sunset timing', desc: 'Tell us your preferred arrival time and we\'ll plan the pickup around it.' },
        { icon: '📍', title: 'Optional stops', desc: 'Combine with a stop in Lavrio or Vouliagmeni on the way back.' },
        { icon: '💶', title: 'One-way or round trip', desc: 'Fixed pricing either way — no meter, no waiting fees for reasonable stays.' }
      ],
      faq: [
        { q: 'What time should I go to see sunset at the temple?', a: 'It varies by season — generally an hour before official sunset gives you time to settle in before the light turns golden. We\'ll help time the pickup once you know your date.' },
        { q: 'Can the driver wait and bring us back?', a: 'Yes, round-trip is our most common booking for Sounio. Just let us know roughly how long you\'d like at the site.' },
        { q: 'Is Sounio worth visiting on a rainy day?', a: 'The temple itself is still striking in poor weather, but the main appeal — the sunset and sea views — is weather-dependent, so we\'d suggest checking the forecast first.' }
      ],
      pickup: 'Athens Centre',
      dropoff: 'Sounio, Greece',
      photos: ['/destinations/sounio-1.jpg', '/destinations/sounio-2.jpg', '/destinations/sounio-3.jpg'],
      alt: 'Temple of Poseidon at Cape Sounio taxi transfer from Athens'
    },
    {
      id: 'kalamata',
      name: 'Kalamata',
      tag: 'Long Distance',
      price: '€318',
      duration: '~3.5 hrs',
      cardDesc: 'Peloponnese coast, olive groves and crystal clear waters. A scenic 3.5-hour drive from Athens.',
      intro: 'Kalamata anchors the southern Peloponnese, roughly 3.5 hours from Athens through olive groves and mountain passes that turn the drive itself into part of the trip. It\'s popular both as a gateway to Messinian beaches and as a connection point for onward island ferries. Because it\'s a longer route, we build in a stop wherever makes sense for you — Ancient Corinth, Kalamata\'s own old town, or straight through if you\'re catching a flight from Kalamata International Airport.',
      highlights: [
        { icon: '🏞️', title: 'Scenic Peloponnese route', desc: 'Olive groves, mountain passes, and coastline along the way.' },
        { icon: '🏛️', title: 'Optional Ancient Corinth stop', desc: 'Break up the drive with a stop at one of Greece\'s major archaeological sites.' },
        { icon: '✈️', title: 'Airport & ferry connections', desc: 'Direct to Kalamata International Airport or the port for island ferries.' },
        { icon: '🚐', title: 'Van available', desc: 'For groups of 5 to 9 passengers with luggage.' }
      ],
      faq: [
        { q: 'Can you stop at Ancient Corinth along the way?', a: 'Yes — just mention it in the notes when booking and we\'ll factor in the extra time.' },
        { q: 'Do you go all the way to Kalamata Airport?', a: 'Yes, we can drop off directly at Kalamata International Airport (KLX) or the port area, whichever you need.' },
        { q: 'Is this trip suitable for a group with luggage?', a: 'For groups of 5 or more, or a lot of luggage, we\'d recommend the van option rather than the standard taxi.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Kalamata, Greece',
      photos: ['/destinations/kalamata-1.jpg', '/destinations/kalamata-2.jpg', '/destinations/kalamata-3.jpg'],
      alt: 'Kalamata coast taxi transfer from Athens'
    },
    {
      id: 'patra',
      name: 'Patra',
      tag: 'Ferry Connection',
      price: '€285',
      duration: '~3 hrs',
      cardDesc: 'Gateway to the Ionian islands. Greece\'s third largest city with a famous carnival and stunning bridge.',
      intro: 'Patra is Greece\'s third-largest city and the main departure point for ferries to Italy and the Ionian islands, which makes timing the transfer around a sailing the whole point of the trip. It\'s about 3 hours from Athens along the coastal highway, past the striking Rio–Antirrio bridge. We track ferry schedules the same way we track flights, so if your crossing is delayed, we adjust rather than leaving you stranded.',
      highlights: [
        { icon: '⛴️', title: 'Timed around your ferry', desc: 'We plan pickup time against your sailing, not a fixed slot.' },
        { icon: '🌉', title: 'Coastal route', desc: 'Via the Rio–Antirrio bridge, one of the longer suspension bridges in Europe.' },
        { icon: '🕒', title: '~3-hour drive', desc: 'From central Athens or the airport.' },
        { icon: '💶', title: 'Fixed price', desc: 'Regardless of traffic on the day.' }
      ],
      faq: [
        { q: 'Do you monitor ferry departure times?', a: 'Yes, the same way we track flights for airport transfers — we build in the buffer needed around your specific sailing.' },
        { q: 'What if my ferry is delayed or cancelled?', a: 'Let us know as soon as you\'re aware and we\'ll adjust the pickup — this is common enough with ferry travel that we plan for it.' },
        { q: 'Can I book a one-way transfer only?', a: 'Yes, one-way and round-trip are both available at fixed prices.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Patra, Greece',
      photos: ['/destinations/patra-1.jpg', '/destinations/patra-2.jpg', '/destinations/patra-3.jpg'],
      alt: 'Patra city taxi transfer from Athens'
    },
    {
      id: 'piraeus',
      name: 'Piraeus Port',
      tag: 'Cruise & Ferry',
      price: '€66',
      duration: '~25 min',
      cardDesc: 'Catch your ferry or cruise ship. We\'ll get you there with time to spare.',
      intro: 'Piraeus is the busiest port in Greece and one of the busiest in the Mediterranean, which means it\'s also one of the easiest places to lose half a day if you\'re relying on public transport with luggage in tow. It\'s about 20–30 minutes from central Athens depending on traffic, and we build in extra buffer time automatically for cruise and ferry departures, since port traffic near sailing times can be unpredictable.',
      highlights: [
        { icon: '⏱️', title: '20–30 minutes', desc: 'From central Athens, traffic depending.' },
        { icon: '🛳️', title: 'Cruise & ferry buffer', desc: 'Extra time built in automatically around sailing times.' },
        { icon: '📍', title: 'Direct to your pier', desc: 'Dropped right at your specific terminal, not a general port entrance.' },
        { icon: '🌅', title: 'Early departures covered', desc: 'We run pickups at any hour for early sailings.' }
      ],
      faq: [
        { q: 'Which terminal will you drop me at?', a: 'Tell us your ferry or cruise line and terminal when booking, and we\'ll drop off right there rather than a general port entrance.' },
        { q: 'How early should I leave for a cruise departure?', a: 'We\'d generally suggest arriving 2–3 hours before a cruise departure — we can advise more precisely once we know your cruise line.' },
        { q: 'Can you pick up from a Piraeus hotel too?', a: 'Yes, we cover pickups anywhere in the greater Athens and Piraeus area, not just central Athens.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Piraeus Port, Athens',
      photos: ['/destinations/piraeus-1.jpg', '/destinations/piraeus-2.jpg', '/destinations/piraeus-3.jpg'],
      alt: 'Piraeus Port taxi transfer from Athens'
    }
  ],
  gr: [
    {
      id: 'airport',
      name: 'Αεροδρόμιο Αθήνας',
      tag: 'Μεταφορά Αεροδρομίου',
      wide: true,
      price: '€50',
      duration: '~40 λεπτά',
      cardDesc: 'Γρήγορες, αξιόπιστες μεταφορές από και προς το ΔΑΑ. Παρακολουθούμε την πτήση σας και περιμένουμε αν καθυστερήσετε.',
      intro: 'Το Διεθνές Αεροδρόμιο Αθηνών (ΔΑΑ) βρίσκεται περίπου 35χλμ ανατολικά του κέντρου της πόλης, και ο συγχρονισμός του χρόνου μετράει περισσότερο εδώ απ\' όσο σε καμία άλλη μεταφορά μας. Η υπηρεσία μας παρακολουθεί την πτήση σας σε πραγματικό χρόνο, ώστε μια καθυστερημένη προσγείωση να μη σημαίνει οδηγό που έχει ήδη φύγει. Είτε πιάνετε μια πρωινή πτήση επιστροφής είτε φτάνετε μετά από μακρινό ταξίδι, θα σας περιμένει μια σταθερή, προσυμφωνημένη τιμή — χωρίς μετρητή, χωρίς επιβάρυνση για αποσκευές.',
      highlights: [
        { icon: '✈️', title: 'Παρακολούθηση πτήσης', desc: 'Παρακολουθούμε την πτήση σας και προσαρμοζόμαστε αυτόματα σε καθυστερήσεις, χωρίς επιπλέον χρέωση.' },
        { icon: '💶', title: 'Σταθερή τιμή', desc: 'Μία συμφωνημένη τιμή, από πόρτα σε πόρτα — χωρίς μετρητή, χωρίς εκπλήξεις.' },
        { icon: '🪧', title: 'Υποδοχή με πινακίδα', desc: 'Προαιρετική υποδοχή με το όνομά σας στις αφίξεις.' },
        { icon: '🧳', title: 'Χωρίς χρέωση αποσκευών', desc: 'Οι κανονικές αποσκευές περιλαμβάνονται πάντα στην τιμή.' }
      ],
      faq: [
        { q: 'Πόσο πριν πρέπει να κλείσω μεταφορά αεροδρομίου;', a: 'Μία ή δύο μέρες πριν είναι συνήθως αρκετό, αλλά για πρωινές ώρες ή περίοδο αιχμής προτείνουμε να κλείσετε μόλις έχετε τα στοιχεία της πτήσης.' },
        { q: 'Τι γίνεται αν η πτήση μου έχει καθυστέρηση;', a: 'Παρακολουθούμε τον αριθμό της πτήσης σας απευθείας, οπότε ο οδηγός προσαρμόζει αυτόματα την ώρα παραλαβής — δεν χρεώνεστε επιπλέον για καθυστερημένη προσγείωση.' },
        { q: 'Χρεώνετε επιπλέον για αποσκευές;', a: 'Όχι. Οι κανονικές αποσκευές για τον αριθμό επιβατών που έχετε κλείσει περιλαμβάνονται στη σταθερή τιμή.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Athens City Centre',
      photos: ['/destinations/airport-1.jpg', '/destinations/airport-2.jpg', '/destinations/airport-3.jpg'],
      alt: 'Μεταφορά με ταξί στο Αεροδρόμιο Αθήνας με την MO Transfers4all'
    },
    {
      id: 'meteora',
      name: 'Μετέωρα',
      tag: 'Ημερήσια Εκδρομή',
      price: '€425',
      duration: '~4,5 ώρες',
      cardDesc: 'Αρχαία μοναστήρια σε επιβλητικούς βράχους — ένα από τα πιο εκπληκτικά θεάματα της Ελλάδας.',
      intro: 'Τα Μετέωρα είναι ένα από τα πιο φωτογραφημένα μέρη της Ελλάδας για έναν λόγο: έξι ορθόδοξες μονές χτισμένες απευθείας πάνω σε επιβλητικούς βράχους από ψαμμίτη, μερικές από τον 14ο αιώνα. Είναι μια μεγάλη μέρα — περίπου 4,5 ώρες κάθε διαδρομή από την Αθήνα — γι\' αυτό οι περισσότεροι επισκέπτες προτιμούν ιδιωτική μεταφορά αντί για δημόσια μέσα ή βιαστική ξενάγηση σε γκρουπ. Εσείς καθορίζετε τον ρυθμό, κάνετε στάσεις όπου θέλετε, και ταξιδεύετε με ιδιωτικό ταξί ή van.',
      highlights: [
        { icon: '🚐', title: 'Ιδιωτική μεταφορά', desc: 'Μόνο η παρέα σας, όχι κοινή εκδρομή με λεωφορείο.' },
        { icon: '🛑', title: 'Ευέλικτες στάσεις', desc: 'Ζητήστε στάση για φωτογραφίες ή διάλειμμα όπου θέλετε στη διαδρομή.' },
        { icon: '🌙', title: 'Ημερήσια ή πολυήμερη', desc: 'Επιστροφή αυθημερόν, ή οργανώνουμε πολυήμερη διαμονή.' },
        { icon: '⏱️', title: 'Ο οδηγός περιμένει', desc: 'Ο οδηγός σας περιμένει επί τόπου όσο εξερευνάτε τις μονές.' }
      ],
      faq: [
        { q: 'Μπορούμε να επισκεφτούμε τα Μετέωρα σε ημερήσια εκδρομή;', a: 'Ναι, αν και είναι ολόκληρη μέρα — περίπου 9 ώρες μετ\' επιστροφής μαζί με τον χρόνο στις μονές. Πολλοί επισκέπτες προτιμούν διανυκτέρευση για να τα δούν σωστά.' },
        { q: 'Είναι καλύτερο να διανυκτερεύσουμε;', a: 'Αν θέλετε να προλάβετε ανατολή ή δύση στις μονές χωρίς άγχος χρόνου, μια διανυκτέρευση στην κοντινή Καλαμπάκα αξίζει — μπορούμε να καλύψουμε και τις δύο διαδρομές.' },
        { q: 'Τι να φορέσω για την επίσκεψη στις μονές;', a: 'Απαιτείται σεμνή ενδυμασία: καλυμμένοι ώμοι, και μακρύ παντελόνι ή φούστα κάτω από το γόνατο για όλους. Καλύτερα να φέρετε δικά σας ρούχα αντί να βασιστείτε σε ό,τι διατίθεται επί τόπου.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Meteora, Kalabaka',
      photos: ['/destinations/meteora-1.jpg', '/destinations/meteora-2.jpg', '/destinations/meteora-3.jpg'],
      alt: 'Ημερήσια εκδρομή με ταξί στα Μετέωρα από την Αθήνα'
    },
    {
      id: 'sounio',
      name: 'Ακρωτήριο Σούνιο',
      tag: 'Μισή Μέρα / Ηλιοβασίλεμα',
      price: '€61',
      duration: '~45 λεπτά',
      cardDesc: 'Ναός Ποσειδώνα στο ηλιοβασίλεμα. 45 λεπτά από την Αθήνα κατά μήκος της Αττικής Ριβιέρας.',
      intro: 'Το Ακρωτήριο Σούνιο βρίσκεται στο νότιο άκρο της Αττικής, περίπου 70χλμ από το κέντρο της Αθήνας, όπου ο Ναός του Ποσειδώνα δεσπόζει πάνω από το Αιγαίο από τον 5ο αιώνα π.Χ. Είναι η ευκολότερη από τις μεταφορές μας — γύρω στα 45 λεπτά κατά μήκος της παραλιακής — που την κάνει ιδανική για μισή μέρα ή ηλιοβασίλεμα παρά για ολοήμερη εκδρομή. Πολλοί πελάτες προγραμματίζουν την παραλαβή για το απόγευμα ώστε να φτάσουν ακριβώς όταν το φως γίνεται χρυσό πάνω από τις κολώνες του ναού.',
      highlights: [
        { icon: '🌅', title: 'Πανοραμική παραλιακή διαδρομή', desc: 'Μόλις 45 λεπτά κατά μήκος της Αττικής Ριβιέρας.' },
        { icon: '🌇', title: 'Συγχρονισμός για ηλιοβασίλεμα', desc: 'Πείτε μας την ώρα άφιξης που θέλετε και προγραμματίζουμε την παραλαβή ανάλογα.' },
        { icon: '📍', title: 'Προαιρετικές στάσεις', desc: 'Συνδυάστε με στάση στο Λαύριο ή τη Βουλιαγμένη στην επιστροφή.' },
        { icon: '💶', title: 'Μονή ή με επιστροφή', desc: 'Σταθερή τιμή και στις δύο περιπτώσεις — χωρίς μετρητή, χωρίς χρέωση αναμονής για λογικό διάστημα.' }
      ],
      faq: [
        { q: 'Τι ώρα να πάω για το ηλιοβασίλεμα στον ναό;', a: 'Διαφέρει ανά εποχή — γενικά μία ώρα πριν την επίσημη δύση σας δίνει χρόνο να τακτοποιηθείτε πριν το φως γίνει χρυσό. Θα βοηθήσουμε στον συγχρονισμό μόλις μας πείτε την ημερομηνία.' },
        { q: 'Μπορεί ο οδηγός να περιμένει και να μας φέρει πίσω;', a: 'Ναι, η μετ\' επιστροφής διαδρομή είναι η πιο συχνή κράτηση για το Σούνιο. Πείτε μας απλά πόσο χρόνο θέλετε περίπου επί τόπου.' },
        { q: 'Αξίζει το Σούνιο σε βροχερή μέρα;', a: 'Ο ναός είναι εντυπωσιακός ακόμη και με κακό καιρό, αλλά η κύρια γοητεία — το ηλιοβασίλεμα και η θέα στη θάλασσα — εξαρτάται από τον καιρό, οπότε προτείνουμε να ελέγξετε την πρόγνωση πρώτα.' }
      ],
      pickup: 'Athens Centre',
      dropoff: 'Sounio, Greece',
      photos: ['/destinations/sounio-1.jpg', '/destinations/sounio-2.jpg', '/destinations/sounio-3.jpg'],
      alt: 'Ναός Ποσειδώνα στο Σούνιο, μεταφορά με ταξί από την Αθήνα'
    },
    {
      id: 'kalamata',
      name: 'Καλαμάτα',
      tag: 'Μεγάλη Απόσταση',
      price: '€318',
      duration: '~3,5 ώρες',
      cardDesc: 'Παράκτια Πελοπόννησος, ελαιώνες και κρυστάλλινα νερά. Γραφική διαδρομή 3,5 ωρών από Αθήνα.',
      intro: 'Η Καλαμάτα είναι η βάση της νότιας Πελοποννήσου, περίπου 3,5 ώρες από την Αθήνα μέσα από ελαιώνες και ορεινά περάσματα που κάνουν την ίδια τη διαδρομή μέρος της εμπειρίας. Είναι δημοφιλής τόσο ως πύλη προς τις παραλίες της Μεσσηνίας όσο και ως σημείο σύνδεσης για ferry προς τα νησιά. Επειδή είναι μεγαλύτερη διαδρομή, προσαρμόζουμε τη στάση όπου σας εξυπηρετεί — Αρχαία Κόρινθος, το ιστορικό κέντρο της Καλαμάτας, ή κατευθείαν αν πιάνετε πτήση από το αεροδρόμιο της Καλαμάτας.',
      highlights: [
        { icon: '🏞️', title: 'Γραφική διαδρομή Πελοποννήσου', desc: 'Ελαιώνες, ορεινά περάσματα και ακτογραμμή στη διαδρομή.' },
        { icon: '🏛️', title: 'Προαιρετική στάση Αρχαία Κόρινθο', desc: 'Διακόψτε τη διαδρομή με στάση σε έναν σημαντικό αρχαιολογικό χώρο.' },
        { icon: '✈️', title: 'Σύνδεση αεροδρόμιο & ferry', desc: 'Απευθείας στο αεροδρόμιο Καλαμάτας ή στο λιμάνι για ferry νησιών.' },
        { icon: '🚐', title: 'Διαθέσιμο van', desc: 'Για ομάδες 5 έως 9 επιβατών με αποσκευές.' }
      ],
      faq: [
        { q: 'Μπορείτε να κάνετε στάση στην Αρχαία Κόρινθο;', a: 'Ναι — αναφέρετέ το απλά στις σημειώσεις κατά την κράτηση και θα υπολογίσουμε τον επιπλέον χρόνο.' },
        { q: 'Φτάνετε μέχρι το αεροδρόμιο της Καλαμάτας;', a: 'Ναι, μπορούμε να σας αφήσουμε απευθείας στο Διεθνές Αεροδρόμιο Καλαμάτας (KLX) ή στην περιοχή του λιμανιού, όποιο χρειάζεστε.' },
        { q: 'Είναι κατάλληλη η διαδρομή για ομάδα με αποσκευές;', a: 'Για ομάδες 5 ατόμων και πάνω, ή πολλές αποσκευές, προτείνουμε την επιλογή van αντί για κανονικό ταξί.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Kalamata, Greece',
      photos: ['/destinations/kalamata-1.jpg', '/destinations/kalamata-2.jpg', '/destinations/kalamata-3.jpg'],
      alt: 'Μεταφορά με ταξί στην Καλαμάτα από την Αθήνα'
    },
    {
      id: 'patra',
      name: 'Πάτρα',
      tag: 'Σύνδεση με Ferry',
      price: '€285',
      duration: '~3 ώρες',
      cardDesc: 'Πύλη για τα Ιόνια νησιά. Τρίτη μεγαλύτερη πόλη της Ελλάδας με φημισμένο καρναβάλι.',
      intro: 'Η Πάτρα είναι η τρίτη μεγαλύτερη πόλη της Ελλάδας και το κύριο σημείο αναχώρησης για ferry προς την Ιταλία και τα Ιόνια νησιά, γι\' αυτό ο συγχρονισμός της μεταφοράς με το δρομολόγιο είναι το ζητούμενο. Είναι περίπου 3 ώρες από την Αθήνα μέσω της παραλιακής, περνώντας από την εντυπωσιακή γέφυρα Ρίου–Αντιρρίου. Παρακολουθούμε τα δρομολόγια των ferry όπως παρακολουθούμε τις πτήσεις, οπότε αν η διαδρομή σας έχει καθυστέρηση, προσαρμοζόμαστε αντί να σας αφήσουμε στην τύχη σας.',
      highlights: [
        { icon: '⛴️', title: 'Συγχρονισμένη με το ferry', desc: 'Προγραμματίζουμε την παραλαβή με βάση το δρομολόγιό σας, όχι σταθερή ώρα.' },
        { icon: '🌉', title: 'Παραλιακή διαδρομή', desc: 'Μέσω της γέφυρας Ρίου–Αντιρρίου, μία από τις μεγαλύτερες κρεμαστές γέφυρες της Ευρώπης.' },
        { icon: '🕒', title: 'Διαδρομή ~3 ωρών', desc: 'Από το κέντρο της Αθήνας ή το αεροδρόμιο.' },
        { icon: '💶', title: 'Σταθερή τιμή', desc: 'Ανεξαρτήτως κίνησης την ημέρα.' }
      ],
      faq: [
        { q: 'Παρακολουθείτε τις ώρες αναχώρησης των ferry;', a: 'Ναι, με τον ίδιο τρόπο που παρακολουθούμε τις πτήσεις για μεταφορές αεροδρομίου — υπολογίζουμε το απαραίτητο περιθώριο για το δρομολόγιό σας.' },
        { q: 'Τι γίνεται αν το ferry μου έχει καθυστέρηση ή ακύρωση;', a: 'Ενημερώστε μας μόλις το μάθετε και θα προσαρμόσουμε την παραλαβή — είναι αρκετά συχνό στα ταξίδια με ferry ώστε το έχουμε προβλέψει.' },
        { q: 'Μπορώ να κλείσω μόνο μονή διαδρομή;', a: 'Ναι, τόσο η μονή όσο και η μετ\' επιστροφής διαδρομή είναι διαθέσιμες με σταθερή τιμή.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Patra, Greece',
      photos: ['/destinations/patra-1.jpg', '/destinations/patra-2.jpg', '/destinations/patra-3.jpg'],
      alt: 'Μεταφορά με ταξί στην Πάτρα από την Αθήνα'
    },
    {
      id: 'piraeus',
      name: 'Λιμάνι Πειραιά',
      tag: 'Κρουαζιέρα & Ferry',
      price: '€66',
      duration: '~25 λεπτά',
      cardDesc: 'Προλάβετε το ferry ή το κρουαζιερόπλοιό σας. Σας φτάνουμε εκεί με άνεση χρόνου.',
      intro: 'Ο Πειραιάς είναι το πολυσύχναστο λιμάνι της Ελλάδας και ένα από τα πολυσύχναστα της Μεσογείου, που σημαίνει ότι είναι επίσης εύκολο να χάσετε μισή μέρα αν βασίζεστε σε δημόσια μέσα με αποσκευές. Είναι περίπου 20–30 λεπτά από το κέντρο της Αθήνας ανάλογα με την κίνηση, και προσθέτουμε αυτόματα επιπλέον χρόνο ασφαλείας για αναχωρήσεις κρουαζιερόπλοιων και ferry, καθώς η κίνηση στο λιμάνι κοντά στην ώρα αναχώρησης μπορεί να είναι απρόβλεπτη.',
      highlights: [
        { icon: '⏱️', title: '20–30 λεπτά', desc: 'Από το κέντρο της Αθήνας, ανάλογα με την κίνηση.' },
        { icon: '🛳️', title: 'Περιθώριο κρουαζιέρας & ferry', desc: 'Επιπλέον χρόνος ενσωματωμένος αυτόματα γύρω από την ώρα αναχώρησης.' },
        { icon: '📍', title: 'Απευθείας στην αποβάθρα σας', desc: 'Παράδοση στο συγκεκριμένο τερματικό σας, όχι σε γενική είσοδο λιμανιού.' },
        { icon: '🌅', title: 'Πρωινές αναχωρήσεις', desc: 'Πραγματοποιούμε παραλαβές οποιαδήποτε ώρα για πρωινά δρομολόγια.' }
      ],
      faq: [
        { q: 'Σε ποιο τερματικό θα με αφήσετε;', a: 'Πείτε μας την εταιρεία ferry ή κρουαζιέρας και το τερματικό κατά την κράτηση, και θα σας αφήσουμε ακριβώς εκεί αντί σε γενική είσοδο λιμανιού.' },
        { q: 'Πόσο πριν πρέπει να φύγω για αναχώρηση κρουαζιέρας;', a: 'Γενικά προτείνουμε άφιξη 2–3 ώρες πριν την αναχώρηση της κρουαζιέρας — μπορούμε να σας συμβουλέψουμε πιο συγκεκριμένα μόλις μάθουμε την εταιρεία σας.' },
        { q: 'Παραλαμβάνετε και από ξενοδοχείο στον Πειραιά;', a: 'Ναι, καλύπτουμε παραλαβές οπουδήποτε στην ευρύτερη περιοχή Αθήνας και Πειραιά, όχι μόνο από το κέντρο της Αθήνας.' }
      ],
      pickup: 'Athens International Airport',
      dropoff: 'Piraeus Port, Athens',
      photos: ['/destinations/piraeus-1.jpg', '/destinations/piraeus-2.jpg', '/destinations/piraeus-3.jpg'],
      alt: 'Μεταφορά με ταξί στο Λιμάνι Πειραιά από την Αθήνα'
    }
  ]
}

export function getDestination(lang, slug) {
  const list = destinations[lang] || destinations.en
  return list.find(d => d.id === slug) || null
}

export function getAllSlugs() {
  return destinations.en.map(d => d.id)
}
