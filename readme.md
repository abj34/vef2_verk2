# Vefforritun 2, 2023, verkefni 2: enn betra viðburðakerfi

[Kynning í fyrirlestri](https://www.youtube.com/watch?v=p0z71I1qOCg)

## Markmið

- Vinna með og uppfæra kóða úr keyrandi verkefni
- Setja upp express vef með: routes, EJS templateum, formum með staðfestingu og notendaumsjón
- Setja upp postgres gagnagrunn, vinna með skema og gögn sem til eru og bæta við þau
- Setja upp verkefni í hýsingu

## Verkefnið

Halda skal áfram með [verkefni 2: viðburðakerfi](https://github.com/vefforritun/vef2-2022-v2) frá því í vefforritun 2 árið 2022. Byggja skal ofan á [sýnilausn sem gefin var út](https://github.com/vefforritun/vef2-2022-v2-synilausn) (ekki er krafa að gera; það má byggja verkefnið alveg frá grunni en það er töluvert meiri vinna.)

### Uppfærslur á pökkum og lagfæringar

Uppfæra skal alla pakka í verkefni í nýjustu útgáfu og passa að verkefni keyri.

Uppfæra skal þ.a. nota skal node útgáfu 18.

Laga skal hvernig test keyra, ef test sem nota test gagnagrunn keyra geta þau skilið eftir gögn sem valda því að næsta keyrsla getur ekki „droppa“ gagnagrunni.

### Almennir notendur og skráning á viðburði

Bæta skal við virkni fyrir „almenna notendur“ (þ.e.a.s. ekki stjórnendur) með nýskráningu og innskráningu.

Skráning á viðburði krefur notanda um að vera innskráður eða fara gegnum nýskráningu.

Notendur sem eru innskráðir geta skráð sig á viðburði eða skráð sig af þeim.

### Möguleiki á að eyða viðburðum og auka gögn

Bæta skal við möguleika á að eyða viðburðum ef innskráður notandi er stjórnandi.

Bæta við fleiri gögnum á viðburði:

- Staðsetning, má vera tóm.
- Slóð (URL), má vera tóm.

### Paging á viðburðum

Bæta skal við _paging_ á gögnum þ.a. ef viðburðir fara yfir 10 þá sé boðið upp á að fara á næstu síðu. Á síðu sem sýnir viðuburði 11+ skal bjóða upp á að fara á fyrri síðu.

Ekki þarf að bæta við paging á skráningar.

### Tæki, tól og test

`eslint` og `jest` er uppsett í verkefninu. Ekki ættu að vera neinar `eslint` villur og öll test ættu að keyra.

Bæta skal við a.m.k. einu testi fyrir hverja nýja virkni.

Aðeins skal nota ECMAScript modules (ESM) og ekki CommonJS.

### GitHub og hýsing

Setja skal upp vefinn á Render, Railway eða Heroku (ath að uppsetning á Heroku mun kosta) tengt við GitHub með postgres settu upp.

## Mat

- 10% Uppfærslur á pökkum og lagfæringar
- 30% Almennir notendur og skráning á viðburði
- 20% Möguleiki á að eyða viðburðum og auka gögn
- 20% Paging á viðburðum
- 10% Tæki, tól og test
- 10% GitHub og hýsing

## Sett fyrir

Verkefni sett fyrir í fyrirlestri mánudaginn 6. febrúar 2023.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags fimmtudaginn 23. febrúar 2023.

Skil skulu innihalda:

- Slóð á verkefni keyrandi í hýsingu.
- Slóð á GitHub repo fyrir verkefni. Dæmatímakennurum skal hafa verið boðið í repo. Notendanöfn þeirra eru:
  - `MarzukIngi`
  - `ofurtumi`
  - `osk`

---

> Útgáfa 0.1

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Fyrsta útgáfa |

# Vef2 2022, verkefni 2 sýnilausn

Sýnilausn á [verkefni 2](https://github.com/vefforritun/vef2-2022-v2).

```bash
createdb vef2-2022-v2
createdb vef2-2022-v2-test
# setja upp .env & .env.test með tengingu í gagnagrunna
npm install
npm run test
npm run setup
npm start # eða `npm run dev`
```
