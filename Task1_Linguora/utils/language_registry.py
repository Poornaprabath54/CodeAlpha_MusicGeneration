LANGUAGE_METADATA = {
"EN":{"native":"English","name":"English","dir":"ltr","region":"Global"},
"ES":{"native":"Español","name":"Spanish","dir":"ltr","region":"Europe / Americas"},
"FR":{"native":"Français","name":"French","dir":"ltr","region":"Europe / Africa"},
"DE":{"native":"Deutsch","name":"German","dir":"ltr","region":"Europe"},
"IT":{"native":"Italiano","name":"Italian","dir":"ltr","region":"Europe"},
"PT":{"native":"Português","name":"Portuguese","dir":"ltr","region":"Global"},
"JA":{"native":"日本語","name":"Japanese","dir":"ltr","region":"Asia"},
"KO":{"native":"한국어","name":"Korean","dir":"ltr","region":"Asia"},
"ZH":{"native":"中文","name":"Chinese","dir":"ltr","region":"Asia"},
"AR":{"native":"العربية","name":"Arabic","dir":"rtl","region":"Middle East"},
"HI":{"native":"हिन्दी","name":"Hindi","dir":"ltr","region":"India"},
"TE":{"native":"తెలుగు","name":"Telugu","dir":"ltr","region":"India"},
"TA":{"native":"தமிழ்","name":"Tamil","dir":"ltr","region":"India"},
"MR":{"native":"मराठी","name":"Marathi","dir":"ltr","region":"India"},
"BN":{"native":"বাংলা","name":"Bengali","dir":"ltr","region":"India / Bangladesh"},
"UR":{"native":"اردو","name":"Urdu","dir":"rtl","region":"South Asia"},
"RU":{"native":"Русский","name":"Russian","dir":"ltr","region":"Europe / Asia"}}

def enrich_language_data(api_languages):
    out=[]
    for lang in api_languages:
        code=lang["code"].upper()
        meta=LANGUAGE_METADATA.get(code.split("-")[0],{})
        out.append({"code":code,"name":lang["name"],"native":meta.get("native",lang["name"]),
                    "dir":meta.get("dir","ltr"),"region":meta.get("region","Global")})
    return out
