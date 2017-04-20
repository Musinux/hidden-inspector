# Dump hidden fields in forms

Usage
```
npm install -g Musinux/hidden-inspector
hiddenfields
Usage: hiddenfields <website dump directory> <site basename>
```

First, dump a website, next analyse it with the `hiddenfields` command
```
mkdir dumps/
cd dumps/
wget --recursive -l 5 http://example.com -R git,jpg,pdf,png,css,JPG,JPEG -nc
hiddenfields example.com/ http://example.com
```

Output:
```
url field_name  form_action
http://example.com/login _csrf_token /login_check
...
```
