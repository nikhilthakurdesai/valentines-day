# Fix letter stray text (Unicode apostrophe U+2019)
path = 'index.html'
with open(path, 'r', encoding='utf-8') as f:
    p = f.read()
# Remove stray .' after "ride." (apostrophe is U+2019)
p = p.replace("ride.\u2019<br><br>", "ride.<br><br>")
# Fix: remove stray " Here' " before Happy (apostrophe U+2019)
p = p.replace(" Here\u2019          Happy", "          Happy")
with open(path, 'w', encoding='utf-8') as f:
    f.write(p)
print('Done')
