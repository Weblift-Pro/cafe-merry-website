/* =========================================================
   CAFÉ MERRY – Inhalte zum einfachen Bearbeiten
   ---------------------------------------------------------
   Hier pflegst du Öffnungszeiten, Speisekarte, Getränke
   und Neuigkeiten. Keine Programmierkenntnisse nötig:
   Texte zwischen den Anführungszeichen ändern, speichern, fertig.

   preis: null      -> zeigt "Preis folgt"
   preis: "4,50 €"  -> zeigt den Preis
   pruefen: true    -> Angabe stammt aus öffentlicher Recherche
                       und muss vom Café bestätigt werden
   ========================================================= */

window.MERRY = {

  /* ---------- Kontakt ---------- */
  kontakt: {
    telefon: "+49 176 45804001",
    telefonAnzeige: "0176 45804001",
    whatsapp: "4917643311705",              // Abendlieferung per WhatsApp (laut Schwäbische Zeitung)
    whatsappAnzeige: "0176 43311705",
    email: "",                               // PLATZHALTER – sobald bestätigt eintragen
    instagram: "https://www.instagram.com/cafe_merry_biberach/",
    adresse: "Theaterstraße 23, 88400 Biberach an der Riß"
  },

  /* ---------- Öffnungszeiten ----------
     Quelle: Schwäbische Zeitung (Eröffnungsbericht 2026): "täglich 9 bis 21 Uhr".
     PLATZHALTER – vor Veröffentlichung vom Café bestätigen lassen. */
  oeffnungszeiten: [
    { tag: "Montag",     zeit: "9 – 21 Uhr" },
    { tag: "Dienstag",   zeit: "9 – 21 Uhr" },
    { tag: "Mittwoch",   zeit: "9 – 21 Uhr" },
    { tag: "Donnerstag", zeit: "9 – 21 Uhr" },
    { tag: "Freitag",    zeit: "9 – 21 Uhr" },
    { tag: "Samstag",    zeit: "9 – 21 Uhr" },
    { tag: "Sonntag",    zeit: "9 – 21 Uhr" }
  ],
  lieferzeiten: "täglich 18 – 20 Uhr per WhatsApp",

  /* ---------- Speisekarte ---------- */
  speisekarte: [
    {
      id: "fruehstueck",
      titel: "Frühstück",
      untertitel: "Für einen guten Start",
      gerichte: [
        { name: "Shakshuka", text: "Eier, in würziger Tomaten-Paprika-Sauce gegart.", preis: null, tags: [] },
        { name: "Avocado-Toast", text: "Geröstetes Brot mit frischer Avocado.", preis: null, tags: [] },
        { name: "Müsli", text: "Knuspriges Müsli – leicht und frisch.", preis: null, tags: [] },
        { name: "Vegane Frühstücksplatte", text: "Eine pflanzliche Frühstücksplatte zum Teilen oder Genießen.", preis: null, tags: ["vegan"], pruefen: true }
      ]
    },
    {
      id: "kleine-gerichte",
      titel: "Kleine Gerichte",
      untertitel: "Mittags & abends",
      gerichte: [
        { name: "Kuku", text: "Persische Frittata aus Eiern und vielen frischen Kräutern – ein Rezept aus der Familie.", preis: null, tags: ["persische Spezialität"] },
        { name: "Pasta", text: "Frag gern nach der aktuellen Variante.", preis: null, tags: [] }
      ]
    },
    {
      id: "salate",
      titel: "Salate",
      untertitel: "Frisch angerichtet",
      gerichte: [
        { name: "Maultaschensalat", text: "Schwäbischer Klassiker, frisch angemacht.", preis: null, tags: [] },
        { name: "Salat mit veganem Käse", text: "Knackiger Salat mit pflanzlichem Käse.", preis: null, tags: ["vegan"], pruefen: true }
      ]
    },
    {
      id: "suesses",
      titel: "Süße Speisen",
      untertitel: "Täglich frisch gebacken",
      gerichte: [
        { name: "Hausgemachte Kuchen", text: "Jeden Tag frisch gebacken – die Auswahl wechselt. Frag nach dem Kuchen des Tages.", preis: null, tags: ["hausgemacht"] },
        { name: "Tiramisu", text: "Der Klassiker mit Espresso – cremig und süß.", preis: null, tags: [] }
      ]
    },
    {
      id: "vegan",
      titel: "Vegane Alternativen",
      untertitel: "Pflanzlich genießen",
      gerichte: [
        { name: "Vegane Frühstücksplatte", text: "Eine pflanzliche Frühstücksplatte zum Teilen oder Genießen.", preis: null, tags: ["vegan"], pruefen: true },
        { name: "Vegane Joghurt-Müsli-Bowl", text: "Pflanzlicher Joghurt mit Müsli.", preis: null, tags: ["vegan"], pruefen: true },
        { name: "Salat mit veganem Käse", text: "Knackiger Salat mit pflanzlichem Käse.", preis: null, tags: ["vegan"], pruefen: true }
      ]
    }
  ],

  /* ---------- Getränke ----------
     Bestätigt ist bisher nur: Kaffee.
     Weitere Getränke einfach als neue Zeile ergänzen, z. B.:
     { name: "Cappuccino", text: "…", preis: "3,80 €" }            */
  getraenke: [
    { name: "Kaffee", text: "Frisch zubereitet – der Duft, der dich in der Theaterstraße empfängt.", preis: null }
  ],

  /* ---------- Neuigkeiten ----------
     Neueste Meldung nach oben. bild = Name aus der Bildliste (siehe main.js) */
  neuigkeiten: [
    {
      kategorie: "Neu in Biberach",
      datum: "2026",
      titel: "Aus einem Leerstand wurde unser Café",
      text: "Wir haben die Räume in der Theaterstraße 23 selbst umgebaut, renoviert und mit viel Liebe eingerichtet – mit pastellfarbenen Wänden und gemütlichen Plätzen. Schön, dass du da bist.",
      bild: "interior"
    },
    {
      kategorie: "Service",
      datum: "Täglich",
      titel: "Abendlieferung per WhatsApp",
      text: "Zwischen 18 und 20 Uhr liefern wir – bestell einfach per WhatsApp.",
      bild: "pasta"
    },
    {
      kategorie: "Süße Momente",
      datum: "Jeden Tag",
      titel: "Kuchen – täglich frisch gebacken",
      text: "Unsere Kuchen backen wir jeden Tag selbst. Was es heute gibt? Komm vorbei oder ruf kurz an.",
      bild: "cake"
    },
    {
      kategorie: "Spezialität",
      datum: "Persische Küche",
      titel: "Schon Kuku probiert?",
      text: "Die persische Kräuter-Frittata ist ein Rezept aus unserer Familie – frisch, würzig und anders als alles, was du kennst.",
      bild: "kuku"
    },
    {
      kategorie: "Empfohlen",
      datum: "Herbst",
      titel: "Gemütlich einkehren in Biberach",
      text: "Visit Biberach empfiehlt das Café Merry für gemütliche Herbsttage. Wir freuen uns auf dich.",
      bild: "latte"
    }
  ]
};
