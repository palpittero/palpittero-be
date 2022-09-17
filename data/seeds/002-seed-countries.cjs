exports.seed = async function (knex) {
  await knex('countries').del()
  await knex('countries').insert([
    {
      fifa: 'BUL',
      cioc: 'BUL',
      cca2: 'BG',
      cca3: 'BGR',
      name: 'Bulgária',
      flag: 'https://flagcdn.com/w320/bg.png'
    },
    {
      fifa: 'BOT',
      cioc: 'BOT',
      cca2: 'BW',
      cca3: 'BWA',
      name: 'Botswana',
      flag: 'https://flagcdn.com/w320/bw.png'
    },
    {
      fifa: 'GUI',
      cioc: 'GUI',
      cca2: 'GN',
      cca3: 'GIN',
      name: 'Guiné',
      flag: 'https://flagcdn.com/w320/gn.png'
    },
    {
      fifa: 'BRB',
      cioc: 'BAR',
      cca2: 'BB',
      cca3: 'BRB',
      name: 'Barbados',
      flag: 'https://flagcdn.com/w320/bb.png'
    },
    {
      fifa: 'SEN',
      cioc: 'SEN',
      cca2: 'SN',
      cca3: 'SEN',
      name: 'Senegal',
      flag: 'https://flagcdn.com/w320/sn.png'
    },
    {
      cca2: 'GP',
      cca3: 'GLP',
      name: 'Guadalupe',
      flag: 'https://flagcdn.com/w320/gp.png'
    },
    {
      cca2: 'GF',
      cca3: 'GUF',
      name: 'Guiana Francesa',
      flag: 'https://flagcdn.com/w320/gf.png'
    },
    {
      fifa: 'MLI',
      cioc: 'MLI',
      cca2: 'ML',
      cca3: 'MLI',
      name: 'Mali',
      flag: 'https://flagcdn.com/w320/ml.png'
    },
    {
      fifa: 'NAM',
      cioc: 'NAM',
      cca2: 'NA',
      cca3: 'NAM',
      name: 'Namíbia',
      flag: 'https://flagcdn.com/w320/na.png'
    },
    {
      fifa: 'UKR',
      cioc: 'UKR',
      cca2: 'UA',
      cca3: 'UKR',
      name: 'Ucrânia',
      flag: 'https://flagcdn.com/w320/ua.png'
    },
    {
      fifa: 'COK',
      cioc: 'COK',
      cca2: 'CK',
      cca3: 'COK',
      name: 'Ilhas Cook',
      flag: 'https://flagcdn.com/w320/ck.png'
    },
    {
      fifa: 'GEO',
      cioc: 'GEO',
      cca2: 'GE',
      cca3: 'GEO',
      name: 'Geórgia',
      flag: 'https://flagcdn.com/w320/ge.png'
    },
    {
      fifa: 'MKD',
      cioc: 'MKD',
      cca2: 'MK',
      cca3: 'MKD',
      name: 'Macedónia do Norte',
      flag: 'https://flagcdn.com/w320/mk.png'
    },
    {
      fifa: 'AFG',
      cioc: 'AFG',
      cca2: 'AF',
      cca3: 'AFG',
      name: 'Afeganistão',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png'
    },
    {
      cca2: 'SH',
      cca3: 'SHN',
      name: 'Santa Helena, Ascensão e Tristão da Cunha',
      flag: 'https://flagcdn.com/w320/sh.png'
    },
    {
      fifa: 'VEN',
      cioc: 'VEN',
      cca2: 'VE',
      cca3: 'VEN',
      name: 'Venezuela',
      flag: 'https://flagcdn.com/w320/ve.png'
    },
    {
      fifa: 'STP',
      cioc: 'STP',
      cca2: 'ST',
      cca3: 'STP',
      name: 'São Tomé e Príncipe',
      flag: 'https://flagcdn.com/w320/st.png'
    },
    {
      fifa: 'HUN',
      cioc: 'HUN',
      cca2: 'HU',
      cca3: 'HUN',
      name: 'Hungria',
      flag: 'https://flagcdn.com/w320/hu.png'
    },
    {
      fifa: 'SOL',
      cioc: 'SOL',
      cca2: 'SB',
      cca3: 'SLB',
      name: 'Ilhas Salomão',
      flag: 'https://flagcdn.com/w320/sb.png'
    },
    {
      fifa: 'COD',
      cioc: 'COD',
      cca2: 'CD',
      cca3: 'COD',
      name: 'República Democrática do Congo',
      flag: 'https://flagcdn.com/w320/cd.png'
    },
    {
      fifa: 'BRA',
      cioc: 'BRA',
      cca2: 'BR',
      cca3: 'BRA',
      name: 'Brasil',
      flag: 'https://flagcdn.com/w320/br.png'
    },
    {
      fifa: 'MOZ',
      cioc: 'MOZ',
      cca2: 'MZ',
      cca3: 'MOZ',
      name: 'Moçambique',
      flag: 'https://flagcdn.com/w320/mz.png'
    },
    {
      fifa: 'CTA',
      cioc: 'CAF',
      cca2: 'CF',
      cca3: 'CAF',
      name: 'República Centro-Africana',
      flag: 'https://flagcdn.com/w320/cf.png'
    },
    {
      cca2: 'NF',
      cca3: 'NFK',
      name: 'Ilha Norfolk',
      flag: 'https://flagcdn.com/w320/nf.png'
    },
    {
      fifa: 'GIB',
      cca2: 'GI',
      cca3: 'GIB',
      name: 'Gibraltar',
      flag: 'https://flagcdn.com/w320/gi.png'
    },
    {
      fifa: 'CAY',
      cioc: 'CAY',
      cca2: 'KY',
      cca3: 'CYM',
      name: 'Ilhas Caimão',
      flag: 'https://flagcdn.com/w320/ky.png'
    },
    {
      fifa: 'LAO',
      cioc: 'LAO',
      cca2: 'LA',
      cca3: 'LAO',
      name: 'Laos',
      flag: 'https://flagcdn.com/w320/la.png'
    },
    {
      fifa: 'TUR',
      cioc: 'TUR',
      cca2: 'TR',
      cca3: 'TUR',
      name: 'Turquia',
      flag: 'https://flagcdn.com/w320/tr.png'
    },
    {
      fifa: 'RSA',
      cioc: 'RSA',
      cca2: 'ZA',
      cca3: 'ZAF',
      name: 'África do Sul',
      flag: 'https://flagcdn.com/w320/za.png'
    },
    {
      fifa: 'SRI',
      cioc: 'SRI',
      cca2: 'LK',
      cca3: 'LKA',
      name: 'Sri Lanka',
      flag: 'https://flagcdn.com/w320/lk.png'
    },
    {
      fifa: 'NGA',
      cioc: 'NGR',
      cca2: 'NG',
      cca3: 'NGA',
      name: 'Nigéria',
      flag: 'https://flagcdn.com/w320/ng.png'
    },
    {
      fifa: 'TCA',
      cca2: 'TC',
      cca3: 'TCA',
      name: 'Ilhas Turks e Caicos',
      flag: 'https://flagcdn.com/w320/tc.png'
    },
    {
      fifa: 'SWE',
      cioc: 'SWE',
      cca2: 'SE',
      cca3: 'SWE',
      name: 'Suécia',
      flag: 'https://flagcdn.com/w320/se.png'
    },
    {
      fifa: 'FRO',
      cca2: 'FO',
      cca3: 'FRO',
      name: 'Ilhas Faroé',
      flag: 'https://flagcdn.com/w320/fo.png'
    },
    {
      fifa: 'SWZ',
      cioc: 'SWZ',
      cca2: 'SZ',
      cca3: 'SWZ',
      name: 'Suazilândia',
      flag: 'https://flagcdn.com/w320/sz.png'
    },
    {
      fifa: 'PHI',
      cioc: 'PHI',
      cca2: 'PH',
      cca3: 'PHL',
      name: 'Filipinas',
      flag: 'https://flagcdn.com/w320/ph.png'
    },
    {
      fifa: 'ROU',
      cioc: 'ROU',
      cca2: 'RO',
      cca3: 'ROU',
      name: 'Roménia',
      flag: 'https://flagcdn.com/w320/ro.png'
    },
    {
      fifa: 'DMA',
      cioc: 'DMA',
      cca2: 'DM',
      cca3: 'DMA',
      name: 'Dominica',
      flag: 'https://flagcdn.com/w320/dm.png'
    },
    {
      fifa: 'KGZ',
      cioc: 'KGZ',
      cca2: 'KG',
      cca3: 'KGZ',
      name: 'Quirguistão',
      flag: 'https://flagcdn.com/w320/kg.png'
    },
    {
      fifa: 'SSD',
      cioc: 'SSD',
      cca2: 'SS',
      cca3: 'SSD',
      name: 'Sudão do Sul',
      flag: 'https://flagcdn.com/w320/ss.png'
    },
    {
      fifa: 'VIR',
      cioc: 'ISV',
      cca2: 'VI',
      cca3: 'VIR',
      name: 'Ilhas Virgens dos Estados Unidos',
      flag: 'https://flagcdn.com/w320/vi.png'
    },
    {
      cca2: 'AQ',
      cca3: 'ATA',
      name: 'Antártida',
      flag: 'https://flagcdn.com/w320/aq.png'
    },
    {
      fifa: 'BEN',
      cioc: 'BEN',
      cca2: 'BJ',
      cca3: 'BEN',
      name: 'Benin',
      flag: 'https://flagcdn.com/w320/bj.png'
    },
    {
      fifa: 'UZB',
      cioc: 'UZB',
      cca2: 'UZ',
      cca3: 'UZB',
      name: 'Uzbequistão',
      flag: 'https://flagcdn.com/w320/uz.png'
    },
    {
      fifa: 'PAK',
      cioc: 'PAK',
      cca2: 'PK',
      cca3: 'PAK',
      name: 'Paquistão',
      flag: 'https://flagcdn.com/w320/pk.png'
    },
    {
      fifa: 'RWA',
      cioc: 'RWA',
      cca2: 'RW',
      cca3: 'RWA',
      name: 'Ruanda',
      flag: 'https://flagcdn.com/w320/rw.png'
    },
    {
      fifa: 'MLT',
      cioc: 'MLT',
      cca2: 'MT',
      cca3: 'MLT',
      name: 'Malta',
      flag: 'https://flagcdn.com/w320/mt.png'
    },
    {
      fifa: 'SLV',
      cioc: 'ESA',
      cca2: 'SV',
      cca3: 'SLV',
      name: 'El Salvador',
      flag: 'https://flagcdn.com/w320/sv.png'
    },
    {
      fifa: 'PER',
      cioc: 'PER',
      cca2: 'PE',
      cca3: 'PER',
      name: 'Perú',
      flag: 'https://flagcdn.com/w320/pe.png'
    },
    {
      fifa: 'ITA',
      cioc: 'ITA',
      cca2: 'IT',
      cca3: 'ITA',
      name: 'Itália',
      flag: 'https://flagcdn.com/w320/it.png'
    },
    {
      cca2: 'GS',
      cca3: 'SGS',
      name: 'Ilhas Geórgia do Sul e Sandwich do Sul',
      flag: 'https://flagcdn.com/w320/gs.png'
    },
    {
      fifa: 'VIE',
      cioc: 'VIE',
      cca2: 'VN',
      cca3: 'VNM',
      name: 'Vietname',
      flag: 'https://flagcdn.com/w320/vn.png'
    },
    {
      fifa: 'ZAM',
      cioc: 'ZAM',
      cca2: 'ZM',
      cca3: 'ZMB',
      name: 'Zâmbia',
      flag: 'https://flagcdn.com/w320/zm.png'
    },
    {
      fifa: 'NZL',
      cioc: 'NZL',
      cca2: 'NZ',
      cca3: 'NZL',
      name: 'Nova Zelândia',
      flag: 'https://flagcdn.com/w320/nz.png'
    },
    {
      fifa: 'SOM',
      cioc: 'SOM',
      cca2: 'SO',
      cca3: 'SOM',
      name: 'Somália',
      flag: 'https://flagcdn.com/w320/so.png'
    },
    {
      cioc: 'MON',
      cca2: 'MC',
      cca3: 'MCO',
      name: 'Mónaco',
      flag: 'https://flagcdn.com/w320/mc.png'
    },
    {
      fifa: 'KEN',
      cioc: 'KEN',
      cca2: 'KE',
      cca3: 'KEN',
      name: 'Quénia',
      flag: 'https://flagcdn.com/w320/ke.png'
    },
    {
      cca2: 'BV',
      cca3: 'BVT',
      name: 'Ilha Bouvet',
      flag: 'https://flagcdn.com/w320/bv.png'
    },
    {
      fifa: 'SDN',
      cioc: 'SUD',
      cca2: 'SD',
      cca3: 'SDN',
      name: 'Sudão',
      flag: 'https://flagcdn.com/w320/sd.png'
    },
    {
      cca2: 'UM',
      cca3: 'UMI',
      name: 'Ilhas Menores Distantes dos Estados Unidos',
      flag: 'https://flagcdn.com/w320/um.png'
    },
    {
      fifa: 'VAN',
      cioc: 'VAN',
      cca2: 'VU',
      cca3: 'VUT',
      name: 'Vanuatu',
      flag: 'https://flagcdn.com/w320/vu.png'
    },
    {
      fifa: 'FIJ',
      cioc: 'FIJ',
      cca2: 'FJ',
      cca3: 'FJI',
      name: 'Fiji',
      flag: 'https://flagcdn.com/w320/fj.png'
    },
    {
      fifa: 'AUT',
      cioc: 'AUT',
      cca2: 'AT',
      cca3: 'AUT',
      name: 'Áustria',
      flag: 'https://flagcdn.com/w320/at.png'
    },
    {
      fifa: 'LCA',
      cioc: 'LCA',
      cca2: 'LC',
      cca3: 'LCA',
      name: 'Santa Lúcia',
      flag: 'https://flagcdn.com/w320/lc.png'
    },
    {
      fifa: 'ARU',
      cioc: 'ARU',
      cca2: 'AW',
      cca3: 'ABW',
      name: 'Aruba',
      flag: 'https://flagcdn.com/w320/aw.png'
    },
    {
      fifa: 'ALG',
      cioc: 'ALG',
      cca2: 'DZ',
      cca3: 'DZA',
      name: 'Argélia',
      flag: 'https://flagcdn.com/w320/dz.png'
    },
    {
      fifa: 'SEY',
      cioc: 'SEY',
      cca2: 'SC',
      cca3: 'SYC',
      name: 'Seicheles',
      flag: 'https://flagcdn.com/w320/sc.png'
    },
    {
      fifa: 'NED',
      cioc: 'NED',
      cca2: 'NL',
      cca3: 'NLD',
      name: 'Holanda',
      flag: 'https://flagcdn.com/w320/nl.png'
    },
    {
      cioc: 'FSM',
      cca2: 'FM',
      cca3: 'FSM',
      name: 'Micronésia',
      flag: 'https://flagcdn.com/w320/fm.png'
    },
    {
      cca2: 'SX',
      cca3: 'SXM',
      name: 'São Martinho',
      flag: 'https://flagcdn.com/w320/sx.png'
    },
    {
      fifa: 'TGA',
      cioc: 'TGA',
      cca2: 'TO',
      cca3: 'TON',
      name: 'Tonga',
      flag: 'https://flagcdn.com/w320/to.png'
    },
    {
      fifa: 'MNE',
      cioc: 'MNE',
      cca2: 'ME',
      cca3: 'MNE',
      name: 'Montenegro',
      flag: 'https://flagcdn.com/w320/me.png'
    },
    {
      cca2: 'WF',
      cca3: 'WLF',
      name: 'Wallis e Futuna',
      flag: 'https://flagcdn.com/w320/wf.png'
    },
    {
      fifa: 'IRL',
      cioc: 'IRL',
      cca2: 'IE',
      cca3: 'IRL',
      name: 'Irlanda',
      flag: 'https://flagcdn.com/w320/ie.png'
    },
    {
      fifa: 'ATG',
      cioc: 'ANT',
      cca2: 'AG',
      cca3: 'ATG',
      name: 'Antígua e Barbuda',
      flag: 'https://flagcdn.com/w320/ag.png'
    },
    {
      fifa: 'GAM',
      cioc: 'GAM',
      cca2: 'GM',
      cca3: 'GMB',
      name: 'Gâmbia',
      flag: 'https://flagcdn.com/w320/gm.png'
    },
    {
      cca2: 'IM',
      cca3: 'IMN',
      name: 'Ilha de Man',
      flag: 'https://flagcdn.com/w320/im.png'
    },
    {
      cioc: 'KIR',
      cca2: 'KI',
      cca3: 'KIR',
      name: 'Kiribati',
      flag: 'https://flagcdn.com/w320/ki.png'
    },
    {
      fifa: 'TOG',
      cioc: 'TOG',
      cca2: 'TG',
      cca3: 'TGO',
      name: 'Togo',
      flag: 'https://flagcdn.com/w320/tg.png'
    },
    {
      fifa: 'AIA',
      cca2: 'AI',
      cca3: 'AIA',
      name: 'Anguilla',
      flag: 'https://flagcdn.com/w320/ai.png'
    },
    {
      fifa: 'BRU',
      cioc: 'BRU',
      cca2: 'BN',
      cca3: 'BRN',
      name: 'Brunei',
      flag: 'https://flagcdn.com/w320/bn.png'
    },
    {
      fifa: 'BHU',
      cioc: 'BHU',
      cca2: 'BT',
      cca3: 'BTN',
      name: 'Butão',
      flag: 'https://flagcdn.com/w320/bt.png'
    },
    {
      fifa: 'GER',
      cioc: 'GER',
      cca2: 'DE',
      cca3: 'DEU',
      name: 'Alemanha',
      flag: 'https://flagcdn.com/w320/de.png'
    },
    {
      fifa: 'DEN',
      cioc: 'DEN',
      cca2: 'DK',
      cca3: 'DNK',
      name: 'Dinamarca',
      flag: 'https://flagcdn.com/w320/dk.png'
    },
    {
      fifa: 'CHA',
      cioc: 'CHA',
      cca2: 'TD',
      cca3: 'TCD',
      name: 'Chade',
      flag: 'https://flagcdn.com/w320/td.png'
    },
    {
      fifa: 'UAE',
      cioc: 'UAE',
      cca2: 'AE',
      cca3: 'ARE',
      name: 'Emirados Árabes Unidos',
      flag: 'https://flagcdn.com/w320/ae.png'
    },
    {
      fifa: 'SLE',
      cioc: 'SLE',
      cca2: 'SL',
      cca3: 'SLE',
      name: 'Serra Leoa',
      flag: 'https://flagcdn.com/w320/sl.png'
    },
    {
      fifa: 'LUX',
      cioc: 'LUX',
      cca2: 'LU',
      cca3: 'LUX',
      name: 'Luxemburgo',
      flag: 'https://flagcdn.com/w320/lu.png'
    },
    {
      cca2: 'SJ',
      cca3: 'SJM',
      name: 'Ilhas Svalbard e Jan Mayen',
      flag: 'https://flagcdn.com/w320/sj.png'
    },
    {
      fifa: 'BLR',
      cioc: 'BLR',
      cca2: 'BY',
      cca3: 'BLR',
      name: 'Bielorússia',
      flag: 'https://flagcdn.com/w320/by.png'
    },
    {
      fifa: 'GAB',
      cioc: 'GAB',
      cca2: 'GA',
      cca3: 'GAB',
      name: 'Gabão',
      flag: 'https://flagcdn.com/w320/ga.png'
    },
    {
      fifa: 'TUN',
      cioc: 'TUN',
      cca2: 'TN',
      cca3: 'TUN',
      name: 'Tunísia',
      flag: 'https://flagcdn.com/w320/tn.png'
    },
    {
      fifa: 'CYP',
      cioc: 'CYP',
      cca2: 'CY',
      cca3: 'CYP',
      name: 'Chipre',
      flag: 'https://flagcdn.com/w320/cy.png'
    },
    {
      fifa: 'ASA',
      cioc: 'ASA',
      cca2: 'AS',
      cca3: 'ASM',
      name: 'Samoa Americana',
      flag: 'https://flagcdn.com/w320/as.png'
    },
    {
      fifa: 'HKG',
      cioc: 'HKG',
      cca2: 'HK',
      cca3: 'HKG',
      name: 'Hong Kong',
      flag: 'https://flagcdn.com/w320/hk.png'
    },
    {
      fifa: 'HAI',
      cioc: 'HAI',
      cca2: 'HT',
      cca3: 'HTI',
      name: 'Haiti',
      flag: 'https://flagcdn.com/w320/ht.png'
    },
    {
      fifa: 'MTN',
      cioc: 'MTN',
      cca2: 'MR',
      cca3: 'MRT',
      name: 'Mauritânia',
      flag: 'https://flagcdn.com/w320/mr.png'
    },
    {
      fifa: 'COL',
      cioc: 'COL',
      cca2: 'CO',
      cca3: 'COL',
      name: 'Colômbia',
      flag: 'https://flagcdn.com/w320/co.png'
    },
    {
      fifa: 'COM',
      cioc: 'COM',
      cca2: 'KM',
      cca3: 'COM',
      name: 'Comores',
      flag: 'https://flagcdn.com/w320/km.png'
    },
    {
      cioc: 'TUV',
      cca2: 'TV',
      cca3: 'TUV',
      name: 'Tuvalu',
      flag: 'https://flagcdn.com/w320/tv.png'
    },
    {
      fifa: 'IRN',
      cioc: 'IRI',
      cca2: 'IR',
      cca3: 'IRN',
      name: 'Irão',
      flag: 'https://flagcdn.com/w320/ir.png'
    },
    {
      fifa: 'SMR',
      cioc: 'SMR',
      cca2: 'SM',
      cca3: 'SMR',
      name: 'San Marino',
      flag: 'https://flagcdn.com/w320/sm.png'
    },
    {
      fifa: 'POL',
      cioc: 'POL',
      cca2: 'PL',
      cca3: 'POL',
      name: 'Polónia',
      flag: 'https://flagcdn.com/w320/pl.png'
    },
    {
      fifa: 'GHA',
      cioc: 'GHA',
      cca2: 'GH',
      cca3: 'GHA',
      name: 'Gana',
      flag: 'https://flagcdn.com/w320/gh.png'
    },
    {
      fifa: 'GUM',
      cioc: 'GUM',
      cca2: 'GU',
      cca3: 'GUM',
      name: 'Guam',
      flag: 'https://flagcdn.com/w320/gu.png'
    },
    {
      cca2: 'IO',
      cca3: 'IOT',
      name: 'Território Britânico do Oceano Índico',
      flag: 'https://flagcdn.com/w320/io.png'
    },
    {
      fifa: 'KAZ',
      cioc: 'KAZ',
      cca2: 'KZ',
      cca3: 'KAZ',
      name: 'Cazaquistão',
      flag: 'https://flagcdn.com/w320/kz.png'
    },
    {
      fifa: 'LBR',
      cioc: 'LBR',
      cca2: 'LR',
      cca3: 'LBR',
      name: 'Libéria',
      flag: 'https://flagcdn.com/w320/lr.png'
    },
    {
      fifa: 'CGO',
      cioc: 'CGO',
      cca2: 'CG',
      cca3: 'COG',
      name: 'Congo',
      flag: 'https://flagcdn.com/w320/cg.png'
    },
    {
      cca2: 'FK',
      cca3: 'FLK',
      name: 'Ilhas Malvinas',
      flag: 'https://flagcdn.com/w320/fk.png'
    },
    {
      fifa: 'BAN',
      cioc: 'BAN',
      cca2: 'BD',
      cca3: 'BGD',
      name: 'Bangladesh',
      flag: 'https://flagcdn.com/w320/bd.png'
    },
    {
      fifa: 'TAN',
      cioc: 'TAN',
      cca2: 'TZ',
      cca3: 'TZA',
      name: 'Tanzânia',
      flag: 'https://flagcdn.com/w320/tz.png'
    },
    {
      fifa: 'FIN',
      cioc: 'FIN',
      cca2: 'FI',
      cca3: 'FIN',
      name: 'Finlândia',
      flag: 'https://flagcdn.com/w320/fi.png'
    },
    {
      fifa: 'IDN',
      cioc: 'INA',
      cca2: 'ID',
      cca3: 'IDN',
      name: 'Indonésia',
      flag: 'https://flagcdn.com/w320/id.png'
    },
    {
      cca2: 'JE',
      cca3: 'JEY',
      name: 'Jersey',
      flag: 'https://flagcdn.com/w320/je.png'
    },
    {
      fifa: 'PAN',
      cioc: 'PAN',
      cca2: 'PA',
      cca3: 'PAN',
      name: 'Panamá',
      flag: 'https://flagcdn.com/w320/pa.png'
    },
    {
      fifa: 'MYA',
      cioc: 'MYA',
      cca2: 'MM',
      cca3: 'MMR',
      name: 'Myanmar',
      flag: 'https://flagcdn.com/w320/mm.png'
    },
    {
      fifa: 'TKM',
      cioc: 'TKM',
      cca2: 'TM',
      cca3: 'TKM',
      name: 'Turquemenistão',
      flag: 'https://flagcdn.com/w320/tm.png'
    },
    {
      cca2: 'HM',
      cca3: 'HMD',
      name: 'Ilha Heard e Ilhas McDonald',
      flag: 'https://flagcdn.com/w320/hm.png'
    },
    {
      fifa: 'CUW',
      cca2: 'CW',
      cca3: 'CUW',
      name: 'ilha da Curação',
      flag: 'https://flagcdn.com/w320/cw.png'
    },
    {
      fifa: 'EQG',
      cioc: 'GEQ',
      cca2: 'GQ',
      cca3: 'GNQ',
      name: 'Guiné Equatorial',
      flag: 'https://flagcdn.com/w320/gq.png'
    },
    {
      fifa: 'ALB',
      cioc: 'ALB',
      cca2: 'AL',
      cca3: 'ALB',
      name: 'Albânia',
      flag: 'https://flagcdn.com/w320/al.png'
    },
    {
      fifa: 'EGY',
      cioc: 'EGY',
      cca2: 'EG',
      cca3: 'EGY',
      name: 'Egito',
      flag: 'https://flagcdn.com/w320/eg.png'
    },
    {
      cca2: 'MQ',
      cca3: 'MTQ',
      name: 'Martinica',
      flag: 'https://flagcdn.com/w320/mq.png'
    },
    {
      fifa: 'BER',
      cioc: 'BER',
      cca2: 'BM',
      cca3: 'BMU',
      name: 'Bermudas',
      flag: 'https://flagcdn.com/w320/bm.png'
    },
    {
      cca2: 'CC',
      cca3: 'CCK',
      name: 'Ilhas Cocos (Keeling)',
      flag: 'https://flagcdn.com/w320/cc.png'
    },
    {
      fifa: 'PRK',
      cioc: 'PRK',
      cca2: 'KP',
      cca3: 'PRK',
      name: 'Coreia do Norte',
      flag: 'https://flagcdn.com/w320/kp.png'
    },
    {
      fifa: 'QAT',
      cioc: 'QAT',
      cca2: 'QA',
      cca3: 'QAT',
      name: 'Catar',
      flag: 'https://flagcdn.com/w320/qa.png'
    },
    {
      fifa: 'ZIM',
      cioc: 'ZIM',
      cca2: 'ZW',
      cca3: 'ZWE',
      name: 'Zimbabwe',
      flag: 'https://flagcdn.com/w320/zw.png'
    },
    {
      fifa: 'BHR',
      cioc: 'BRN',
      cca2: 'BH',
      cca3: 'BHR',
      name: 'Bahrein',
      flag: 'https://flagcdn.com/w320/bh.png'
    },
    {
      fifa: 'CPV',
      cioc: 'CPV',
      cca2: 'CV',
      cca3: 'CPV',
      name: 'Cabo Verde',
      flag: 'https://flagcdn.com/w320/cv.png'
    },
    {
      cioc: 'MHL',
      cca2: 'MH',
      cca3: 'MHL',
      name: 'Ilhas Marshall',
      flag: 'https://flagcdn.com/w320/mh.png'
    },
    {
      fifa: 'CIV',
      cioc: 'CIV',
      cca2: 'CI',
      cca3: 'CIV',
      name: 'Costa do Marfim',
      flag: 'https://flagcdn.com/w320/ci.png'
    },
    {
      fifa: 'KUW',
      cioc: 'KUW',
      cca2: 'KW',
      cca3: 'KWT',
      name: 'Kuwait',
      flag: 'https://flagcdn.com/w320/kw.png'
    },
    {
      fifa: 'MAC',
      cca2: 'MO',
      cca3: 'MAC',
      name: 'Macau',
      flag: 'https://flagcdn.com/w320/mo.png'
    },
    {
      fifa: 'LIE',
      cioc: 'LIE',
      cca2: 'LI',
      cca3: 'LIE',
      name: 'Liechtenstein',
      flag: 'https://flagcdn.com/w320/li.png'
    },
    {
      fifa: 'KSA',
      cioc: 'KSA',
      cca2: 'SA',
      cca3: 'SAU',
      name: 'Arábia Saudita',
      flag: 'https://flagcdn.com/w320/sa.png'
    },
    {
      fifa: 'NCA',
      cioc: 'NCA',
      cca2: 'NI',
      cca3: 'NIC',
      name: 'Nicarágua',
      flag: 'https://flagcdn.com/w320/ni.png'
    },
    {
      fifa: 'RUS',
      cioc: 'RUS',
      cca2: 'RU',
      cca3: 'RUS',
      name: 'Rússia',
      flag: 'https://flagcdn.com/w320/ru.png'
    },
    {
      fifa: 'MDA',
      cioc: 'MDA',
      cca2: 'MD',
      cca3: 'MDA',
      name: 'Moldávia',
      flag: 'https://flagcdn.com/w320/md.png'
    },
    {
      fifa: 'CRO',
      cioc: 'CRO',
      cca2: 'HR',
      cca3: 'HRV',
      name: 'Croácia',
      flag: 'https://flagcdn.com/w320/hr.png'
    },
    {
      fifa: 'SUR',
      cioc: 'SUR',
      cca2: 'SR',
      cca3: 'SUR',
      name: 'Suriname',
      flag: 'https://flagcdn.com/w320/sr.png'
    },
    {
      fifa: 'SAM',
      cioc: 'SAM',
      cca2: 'WS',
      cca3: 'WSM',
      name: 'Samoa',
      flag: 'https://flagcdn.com/w320/ws.png'
    },
    {
      fifa: 'JOR',
      cioc: 'JOR',
      cca2: 'JO',
      cca3: 'JOR',
      name: 'Jordânia',
      flag: 'https://flagcdn.com/w320/jo.png'
    },
    {
      fifa: 'IRQ',
      cioc: 'IRQ',
      cca2: 'IQ',
      cca3: 'IRQ',
      name: 'Iraque',
      flag: 'https://flagcdn.com/w320/iq.png'
    },
    {
      fifa: 'ARG',
      cioc: 'ARG',
      cca2: 'AR',
      cca3: 'ARG',
      name: 'Argentina',
      flag: 'https://flagcdn.com/w320/ar.png'
    },
    {
      fifa: 'TJK',
      cioc: 'TJK',
      cca2: 'TJ',
      cca3: 'TJK',
      name: 'Tajiquistão',
      flag: 'https://flagcdn.com/w320/tj.png'
    },
    {
      fifa: 'SUI',
      cioc: 'SUI',
      cca2: 'CH',
      cca3: 'CHE',
      name: 'Suíça',
      flag: 'https://flagcdn.com/w320/ch.png'
    },
    {
      fifa: 'ESP',
      cioc: 'ESP',
      cca2: 'ES',
      cca3: 'ESP',
      name: 'Espanha',
      flag: 'https://flagcdn.com/w320/es.png'
    },
    {
      fifa: 'TPE',
      cioc: 'TPE',
      cca2: 'TW',
      cca3: 'TWN',
      name: 'Ilha Formosa',
      flag: 'https://flagcdn.com/w320/tw.png'
    },
    {
      fifa: 'IND',
      cioc: 'IND',
      cca2: 'IN',
      cca3: 'IND',
      name: 'Índia',
      flag: 'https://flagcdn.com/w320/in.png'
    },
    {
      fifa: 'NOR',
      cioc: 'NOR',
      cca2: 'NO',
      cca3: 'NOR',
      name: 'Noruega',
      flag: 'https://flagcdn.com/w320/no.png'
    },
    {
      fifa: 'EST',
      cioc: 'EST',
      cca2: 'EE',
      cca3: 'EST',
      name: 'Estónia',
      flag: 'https://flagcdn.com/w320/ee.png'
    },
    {
      fifa: 'DOM',
      cioc: 'DOM',
      cca2: 'DO',
      cca3: 'DOM',
      name: 'República Dominicana',
      flag: 'https://flagcdn.com/w320/do.png'
    },
    {
      fifa: 'MWI',
      cioc: 'MAW',
      cca2: 'MW',
      cca3: 'MWI',
      name: 'Malawi',
      flag: 'https://flagcdn.com/w320/mw.png'
    },
    {
      fifa: 'SKN',
      cioc: 'SKN',
      cca2: 'KN',
      cca3: 'KNA',
      name: 'São Cristóvão e Nevis',
      flag: 'https://flagcdn.com/w320/kn.png'
    },
    {
      fifa: 'MRI',
      cioc: 'MRI',
      cca2: 'MU',
      cca3: 'MUS',
      name: 'Maurício',
      flag: 'https://flagcdn.com/w320/mu.png'
    },
    {
      fifa: 'NIG',
      cioc: 'NIG',
      cca2: 'NE',
      cca3: 'NER',
      name: 'Níger',
      flag: 'https://flagcdn.com/w320/ne.png'
    },
    {
      fifa: 'CAN',
      cioc: 'CAN',
      cca2: 'CA',
      cca3: 'CAN',
      name: 'Canadá',
      flag: 'https://flagcdn.com/w320/ca.png'
    },
    {
      fifa: 'YEM',
      cioc: 'YEM',
      cca2: 'YE',
      cca3: 'YEM',
      name: 'Iémen',
      flag: 'https://flagcdn.com/w320/ye.png'
    },
    {
      fifa: 'KOR',
      cioc: 'KOR',
      cca2: 'KR',
      cca3: 'KOR',
      name: 'Coreia do Sul',
      flag: 'https://flagcdn.com/w320/kr.png'
    },
    {
      fifa: 'TRI',
      cioc: 'TTO',
      cca2: 'TT',
      cca3: 'TTO',
      name: 'Trinidade e Tobago',
      flag: 'https://flagcdn.com/w320/tt.png'
    },
    {
      fifa: 'AND',
      cioc: 'AND',
      cca2: 'AD',
      cca3: 'AND',
      name: 'Andorra',
      flag: 'https://flagcdn.com/w320/ad.png'
    },
    {
      cca2: 'PN',
      cca3: 'PCN',
      name: 'Ilhas Pitcairn',
      flag: 'https://flagcdn.com/w320/pn.png'
    },
    {
      fifa: 'GNB',
      cioc: 'GBS',
      cca2: 'GW',
      cca3: 'GNB',
      name: 'Guiné-Bissau',
      flag: 'https://flagcdn.com/w320/gw.png'
    },
    {
      fifa: 'DJI',
      cioc: 'DJI',
      cca2: 'DJ',
      cca3: 'DJI',
      name: 'Djibouti',
      flag: 'https://flagcdn.com/w320/dj.png'
    },
    {
      fifa: 'CMR',
      cioc: 'CMR',
      cca2: 'CM',
      cca3: 'CMR',
      name: 'Camarões',
      flag: 'https://flagcdn.com/w320/cm.png'
    },
    {
      fifa: 'AUS',
      cioc: 'AUS',
      cca2: 'AU',
      cca3: 'AUS',
      name: 'Austrália',
      flag: 'https://flagcdn.com/w320/au.png'
    },
    {
      cca2: 'TF',
      cca3: 'ATF',
      name: 'Terras Austrais e Antárticas Francesas',
      flag: 'https://flagcdn.com/w320/tf.png'
    },
    {
      fifa: 'SIN',
      cioc: 'SGP',
      cca2: 'SG',
      cca3: 'SGP',
      name: 'Singapura',
      flag: 'https://flagcdn.com/w320/sg.png'
    },
    {
      cca2: 'RE',
      cca3: 'REU',
      name: 'Reunião',
      flag: 'https://flagcdn.com/w320/re.png'
    },
    {
      fifa: 'PNG',
      cioc: 'PNG',
      cca2: 'PG',
      cca3: 'PNG',
      name: 'Papua Nova Guiné',
      flag: 'https://flagcdn.com/w320/pg.png'
    },
    {
      fifa: 'GRE',
      cioc: 'GRE',
      cca2: 'GR',
      cca3: 'GRC',
      name: 'Grécia',
      flag: 'https://flagcdn.com/w320/gr.png'
    },
    {
      fifa: 'FRA',
      cioc: 'FRA',
      cca2: 'FR',
      cca3: 'FRA',
      name: 'França',
      flag: 'https://flagcdn.com/w320/fr.png'
    },
    {
      fifa: 'VIN',
      cioc: 'VIN',
      cca2: 'VC',
      cca3: 'VCT',
      name: 'São Vincente e Granadinas',
      flag: 'https://flagcdn.com/w320/vc.png'
    },
    {
      fifa: 'URU',
      cioc: 'URU',
      cca2: 'UY',
      cca3: 'URY',
      name: 'Uruguai',
      flag: 'https://flagcdn.com/w320/uy.png'
    },
    {
      fifa: 'SYR',
      cioc: 'SYR',
      cca2: 'SY',
      cca3: 'SYR',
      name: 'Síria',
      flag: 'https://flagcdn.com/w320/sy.png'
    },
    {
      fifa: 'BOL',
      cioc: 'BOL',
      cca2: 'BO',
      cca3: 'BOL',
      name: 'Bolívia',
      flag: 'https://flagcdn.com/w320/bo.png'
    },
    {
      fifa: 'GRN',
      cioc: 'GRN',
      cca2: 'GD',
      cca3: 'GRD',
      name: 'Granada',
      flag: 'https://flagcdn.com/w320/gd.png'
    },
    {
      fifa: 'LTU',
      cioc: 'LTU',
      cca2: 'LT',
      cca3: 'LTU',
      name: 'Lituânia',
      flag: 'https://flagcdn.com/w320/lt.png'
    },
    {
      cca2: 'AX',
      cca3: 'ALA',
      name: 'Alândia',
      flag: 'https://flagcdn.com/w320/ax.png'
    },
    {
      fifa: 'JAM',
      cioc: 'JAM',
      cca2: 'JM',
      cca3: 'JAM',
      name: 'Jamaica',
      flag: 'https://flagcdn.com/w320/jm.png'
    },
    {
      cca2: 'GG',
      cca3: 'GGY',
      name: 'Guernsey',
      flag: 'https://flagcdn.com/w320/gg.png'
    },
    {
      fifa: 'CZE',
      cioc: 'CZE',
      cca2: 'CZ',
      cca3: 'CZE',
      name: 'Chéquia',
      flag: 'https://flagcdn.com/w320/cz.png'
    },
    {
      fifa: 'BEL',
      cioc: 'BEL',
      cca2: 'BE',
      cca3: 'BEL',
      name: 'Bélgica',
      flag: 'https://flagcdn.com/w320/be.png'
    },
    {
      fifa: 'SRB',
      cioc: 'SRB',
      cca2: 'RS',
      cca3: 'SRB',
      name: 'Sérvia',
      flag: 'https://flagcdn.com/w320/rs.png'
    },
    {
      fifa: 'GUA',
      cioc: 'GUA',
      cca2: 'GT',
      cca3: 'GTM',
      name: 'Guatemala',
      flag: 'https://flagcdn.com/w320/gt.png'
    },
    {
      fifa: 'TLS',
      cioc: 'TLS',
      cca2: 'TL',
      cca3: 'TLS',
      name: 'Timor-Leste',
      flag: 'https://flagcdn.com/w320/tl.png'
    },
    {
      fifa: 'BIH',
      cioc: 'BIH',
      cca2: 'BA',
      cca3: 'BIH',
      name: 'Bósnia e Herzegovina',
      flag: 'https://flagcdn.com/w320/ba.png'
    },
    {
      fifa: 'ERI',
      cioc: 'ERI',
      cca2: 'ER',
      cca3: 'ERI',
      name: 'Eritreia',
      flag: 'https://flagcdn.com/w320/er.png'
    },
    {
      cioc: 'NRU',
      cca2: 'NR',
      cca3: 'NRU',
      name: 'Nauru',
      flag: 'https://flagcdn.com/w320/nr.png'
    },
    {
      fifa: 'PAR',
      cioc: 'PAR',
      cca2: 'PY',
      cca3: 'PRY',
      name: 'Paraguai',
      flag: 'https://flagcdn.com/w320/py.png'
    },
    {
      fifa: 'LBN',
      cioc: 'LBN',
      cca2: 'LB',
      cca3: 'LBN',
      name: 'Líbano',
      flag: 'https://flagcdn.com/w320/lb.png'
    },
    {
      fifa: 'MAR',
      cioc: 'MAR',
      cca2: 'MA',
      cca3: 'MAR',
      name: 'Marrocos',
      flag: 'https://flagcdn.com/w320/ma.png'
    },
    {
      fifa: 'HON',
      cioc: 'HON',
      cca2: 'HN',
      cca3: 'HND',
      name: 'Honduras',
      flag: 'https://flagcdn.com/w320/hn.png'
    },
    {
      fifa: 'SVN',
      cioc: 'SLO',
      cca2: 'SI',
      cca3: 'SVN',
      name: 'Eslovénia',
      flag: 'https://flagcdn.com/w320/si.png'
    },
    {
      cioc: 'GBR',
      cca2: 'GB',
      cca3: 'GBR',
      name: 'Reino Unido',
      flag: 'https://flagcdn.com/w320/gb.png'
    },
    {
      cca2: 'MF',
      cca3: 'MAF',
      name: 'São Martinho',
      flag: 'https://flagcdn.com/w320/mf.png'
    },
    {
      fifa: 'AZE',
      cioc: 'AZE',
      cca2: 'AZ',
      cca3: 'AZE',
      name: 'Azerbeijão',
      flag: 'https://flagcdn.com/w320/az.png'
    },
    {
      fifa: 'CRC',
      cioc: 'CRC',
      cca2: 'CR',
      cca3: 'CRI',
      name: 'Costa Rica',
      flag: 'https://flagcdn.com/w320/cr.png'
    },
    {
      fifa: 'KVX',
      cioc: 'KOS',
      cca2: 'XK',
      cca3: 'UNK',
      name: 'Kosovo',
      flag: 'https://flagcdn.com/w320/xk.png'
    },
    {
      fifa: 'CHN',
      cioc: 'CHN',
      cca2: 'CN',
      cca3: 'CHN',
      name: 'China',
      flag: 'https://flagcdn.com/w320/cn.png'
    },
    {
      cioc: 'PLW',
      cca2: 'PW',
      cca3: 'PLW',
      name: 'Palau',
      flag: 'https://flagcdn.com/w320/pw.png'
    },
    {
      fifa: 'POR',
      cioc: 'POR',
      cca2: 'PT',
      cca3: 'PRT',
      name: 'Portugal',
      flag: 'https://flagcdn.com/w320/pt.png'
    },
    {
      fifa: 'CHI',
      cioc: 'CHI',
      cca2: 'CL',
      cca3: 'CHL',
      name: 'Chile',
      flag: 'https://flagcdn.com/w320/cl.png'
    },
    {
      fifa: 'CAM',
      cioc: 'CAM',
      cca2: 'KH',
      cca3: 'KHM',
      name: 'Camboja',
      flag: 'https://flagcdn.com/w320/kh.png'
    },
    {
      fifa: 'LVA',
      cioc: 'LAT',
      cca2: 'LV',
      cca3: 'LVA',
      name: 'Letónia',
      flag: 'https://flagcdn.com/w320/lv.png'
    },
    {
      cca2: 'EH',
      cca3: 'ESH',
      name: 'Saara Ocidental',
      flag: 'https://flagcdn.com/w320/eh.png'
    },
    {
      fifa: 'ANG',
      cioc: 'ANG',
      cca2: 'AO',
      cca3: 'AGO',
      name: 'Angola',
      flag: 'https://flagcdn.com/w320/ao.png'
    },
    {
      fifa: 'USA',
      cioc: 'USA',
      cca2: 'US',
      cca3: 'USA',
      name: 'Estados Unidos',
      flag: 'https://flagcdn.com/w320/us.png'
    },
    {
      cca2: 'YT',
      cca3: 'MYT',
      name: 'Mayotte',
      flag: 'https://flagcdn.com/w320/yt.png'
    },
    {
      cca2: 'BQ',
      cca3: 'BES',
      name: 'Países Baixos Caribenhos',
      flag: 'https://flagcdn.com/w320/bq.png'
    },
    {
      cca2: 'VA',
      cca3: 'VAT',
      name: 'Cidade do Vaticano',
      flag: 'https://flagcdn.com/w320/va.png'
    },
    {
      fifa: 'MEX',
      cioc: 'MEX',
      cca2: 'MX',
      cca3: 'MEX',
      name: 'México',
      flag: 'https://flagcdn.com/w320/mx.png'
    },
    {
      fifa: 'BLZ',
      cioc: 'BIZ',
      cca2: 'BZ',
      cca3: 'BLZ',
      name: 'Belize',
      flag: 'https://flagcdn.com/w320/bz.png'
    },
    {
      fifa: 'THA',
      cioc: 'THA',
      cca2: 'TH',
      cca3: 'THA',
      name: 'Tailândia',
      flag: 'https://flagcdn.com/w320/th.png'
    },
    {
      cca2: 'TK',
      cca3: 'TKL',
      name: 'Tokelau',
      flag: 'https://flagcdn.com/w320/tk.png'
    },
    {
      fifa: 'VGB',
      cioc: 'IVB',
      cca2: 'VG',
      cca3: 'VGB',
      name: 'Ilhas Virgens',
      flag: 'https://flagcdn.com/w320/vg.png'
    },
    {
      fifa: 'ISR',
      cioc: 'ISR',
      cca2: 'IL',
      cca3: 'ISR',
      name: 'Israel',
      flag: 'https://flagcdn.com/w320/il.png'
    },
    {
      fifa: 'MDV',
      cioc: 'MDV',
      cca2: 'MV',
      cca3: 'MDV',
      name: 'Maldivas',
      flag: 'https://flagcdn.com/w320/mv.png'
    },
    {
      fifa: 'UGA',
      cioc: 'UGA',
      cca2: 'UG',
      cca3: 'UGA',
      name: 'Uganda',
      flag: 'https://flagcdn.com/w320/ug.png'
    },
    {
      fifa: 'CUB',
      cioc: 'CUB',
      cca2: 'CU',
      cca3: 'CUB',
      name: 'Cuba',
      flag: 'https://flagcdn.com/w320/cu.png'
    },
    {
      fifa: 'ISL',
      cioc: 'ISL',
      cca2: 'IS',
      cca3: 'ISL',
      name: 'Islândia',
      flag: 'https://flagcdn.com/w320/is.png'
    },
    {
      fifa: 'MNG',
      cioc: 'MGL',
      cca2: 'MN',
      cca3: 'MNG',
      name: 'Mongólia',
      flag: 'https://flagcdn.com/w320/mn.png'
    },
    {
      fifa: 'MAS',
      cioc: 'MAS',
      cca2: 'MY',
      cca3: 'MYS',
      name: 'Malásia',
      flag: 'https://flagcdn.com/w320/my.png'
    },
    {
      fifa: 'NEP',
      cioc: 'NEP',
      cca2: 'NP',
      cca3: 'NPL',
      name: 'Nepal',
      flag: 'https://flagcdn.com/w320/np.png'
    },
    {
      cca2: 'PM',
      cca3: 'SPM',
      name: 'Saint-Pierre e Miquelon',
      flag: 'https://flagcdn.com/w320/pm.png'
    },
    {
      fifa: 'JPN',
      cioc: 'JPN',
      cca2: 'JP',
      cca3: 'JPN',
      name: 'Japão',
      flag: 'https://flagcdn.com/w320/jp.png'
    },
    {
      cca2: 'BL',
      cca3: 'BLM',
      name: 'São Bartolomeu',
      flag: 'https://flagcdn.com/w320/bl.png'
    },
    {
      cca2: 'MP',
      cca3: 'MNP',
      name: 'Marianas Setentrionais',
      flag: 'https://flagcdn.com/w320/mp.png'
    },
    {
      fifa: 'BDI',
      cioc: 'BDI',
      cca2: 'BI',
      cca3: 'BDI',
      name: 'Burundi',
      flag: 'https://flagcdn.com/w320/bi.png'
    },
    {
      cca2: 'GL',
      cca3: 'GRL',
      name: 'Gronelândia',
      flag: 'https://flagcdn.com/w320/gl.png'
    },
    {
      fifa: 'LBY',
      cioc: 'LBA',
      cca2: 'LY',
      cca3: 'LBY',
      name: 'Líbia',
      flag: 'https://flagcdn.com/w320/ly.png'
    },
    {
      fifa: 'ARM',
      cioc: 'ARM',
      cca2: 'AM',
      cca3: 'ARM',
      name: 'Arménia',
      flag: 'https://flagcdn.com/w320/am.png'
    },
    {
      fifa: 'ECU',
      cioc: 'ECU',
      cca2: 'EC',
      cca3: 'ECU',
      name: 'Equador',
      flag: 'https://flagcdn.com/w320/ec.png'
    },
    {
      cca2: 'PF',
      cca3: 'PYF',
      name: 'Polinésia Francesa',
      flag: 'https://flagcdn.com/w320/pf.png'
    },
    {
      fifa: 'BFA',
      cioc: 'BUR',
      cca2: 'BF',
      cca3: 'BFA',
      name: 'Burkina Faso',
      flag: 'https://flagcdn.com/w320/bf.png'
    },
    {
      fifa: 'OMA',
      cioc: 'OMA',
      cca2: 'OM',
      cca3: 'OMN',
      name: 'Omã',
      flag: 'https://flagcdn.com/w320/om.png'
    },
    {
      fifa: 'GUY',
      cioc: 'GUY',
      cca2: 'GY',
      cca3: 'GUY',
      name: 'Guiana',
      flag: 'https://flagcdn.com/w320/gy.png'
    },
    {
      fifa: 'ETH',
      cioc: 'ETH',
      cca2: 'ET',
      cca3: 'ETH',
      name: 'Etiópia',
      flag: 'https://flagcdn.com/w320/et.png'
    },
    {
      fifa: 'MAD',
      cioc: 'MAD',
      cca2: 'MG',
      cca3: 'MDG',
      name: 'Madagáscar',
      flag: 'https://flagcdn.com/w320/mg.png'
    },
    {
      cca2: 'CX',
      cca3: 'CXR',
      name: 'Ilha do Natal',
      flag: 'https://flagcdn.com/w320/cx.png'
    },
    {
      fifa: 'PUR',
      cioc: 'PUR',
      cca2: 'PR',
      cca3: 'PRI',
      name: 'Porto Rico',
      flag: 'https://flagcdn.com/w320/pr.png'
    },
    {
      fifa: 'SVK',
      cioc: 'SVK',
      cca2: 'SK',
      cca3: 'SVK',
      name: 'Eslováquia',
      flag: 'https://flagcdn.com/w320/sk.png'
    },
    {
      fifa: 'LES',
      cioc: 'LES',
      cca2: 'LS',
      cca3: 'LSO',
      name: 'Lesoto',
      flag: 'https://flagcdn.com/w320/ls.png'
    },
    {
      fifa: 'MSR',
      cca2: 'MS',
      cca3: 'MSR',
      name: 'Montserrat',
      flag: 'https://flagcdn.com/w320/ms.png'
    },
    {
      fifa: 'NCL',
      cca2: 'NC',
      cca3: 'NCL',
      name: 'Nova Caledónia',
      flag: 'https://flagcdn.com/w320/nc.png'
    },
    {
      cca2: 'NU',
      cca3: 'NIU',
      name: 'Niue',
      flag: 'https://flagcdn.com/w320/nu.png'
    },
    {
      fifa: 'PLE',
      cioc: 'PLE',
      cca2: 'PS',
      cca3: 'PSE',
      name: 'Palestina',
      flag: 'https://flagcdn.com/w320/ps.png'
    },
    {
      fifa: 'BAH',
      cioc: 'BAH',
      cca2: 'BS',
      cca3: 'BHS',
      name: 'Bahamas',
      flag: 'https://flagcdn.com/w320/bs.png'
    }
  ])
}
