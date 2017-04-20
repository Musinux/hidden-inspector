# Dump hidden fields in forms

First, dump a website with
```
mkdir dumps/
cd dumps/
wget --recursive -l 5 http://example.com -R git,jpg,pdf,png,css,JPG,JPEG -nc
```

Next, analyse it
```
npm install Musinux/hidden-inspector
hiddenfields
Usage: hiddenfields <website dump directory> <site basename>
```

Example
```
cd /home/me/dumps
wget --recursive -l 5 http://example.com -R git,jpg,pdf,png,css,JPG,JPEG -nc
hiddenfields example.com/ http://example.com
```
