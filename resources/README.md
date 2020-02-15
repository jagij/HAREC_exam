How I converted the data to json.

- extract the rar files

```
unrar ...
```

- extract the schema from Examens NL.mdb, and insert it into a sqlite database

```
mdb-schema 'Examens NL.mdb' | sqlite3 db -init -
```

- extract all the tables and insert them

```
for i in ExamenQuestionTable CategorieTable ExamenOverviewTable PersonTable QuestionsTable; do mdb-export -I sqlite Examens\ NL.mdb $i | sqlite3 db -init -; done
```

- export the database to a json file using https://github.com/tkellen/js-sqlite-to-json

- extract all the images

```
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to html NL/A03030301.bmp
```

- rename all the images

```
ls *.gif *.png | while read line; do prefix=${line%%_*}; ext=${line##*.}; mv $line ${prefix}.${ext}; done
```