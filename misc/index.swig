<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>原型盒子</title>
</head>
<body>
    {% for project in projects %}
    <a href="/{{ project }}">{{ project }}</a>
    {% endfor %}
</body>
</html>
