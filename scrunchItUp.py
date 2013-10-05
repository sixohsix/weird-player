#!/usr/bin/env python3

import http.client, urllib.parse, sys

test_mode = [
    "tests/fixture.js",
    "src/weirdPlayer/util.js",
    "src/weirdPlayer/parse.js",
    "src/weirdPlayer/loader.js",
    "src/weirdPlayer/actions.js",
    "src/weirdPlayer/translate.js",
    "src/weirdPlayer/main.js"]

real_mode = [
    "src/weirdPlayer/util.js",
    "src/weirdPlayer/parse.js",
    "src/weirdPlayer/loader.js",
    "src/weirdPlayer/actions.js",
    "src/weirdPlayer/translate.js",
    "src/weirdPlayer/main.js"]

def get_code(file_lst):
    return '\n'.join(open(f).read() for f in file_lst)

params = [
    ('language', 'ECMASCRIPT5_STRICT'),
    ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
#    ('compilation_level', 'WHITESPACE_ONLY'),
    ('output_format', 'text'),
    ('output_info', 'compiled_code'),
  ]

headers = { "Content-type": "application/x-www-form-urlencoded" }

for fl,fn in ((real_mode, "wcp.js"),):
    conn = http.client.HTTPConnection('closure-compiler.appspot.com')
    p = list(params)
    p.append(('js_code', get_code(fl)))
    ps = urllib.parse.urlencode(p)
    conn.request('POST', '/compile', ps, headers)
    response = conn.getresponse()
    data = response.read().decode('utf-8')
    conn.close()
    f = open(fn, 'w')
    print('// Weird Canada Player (c) 2013 Mike Verdone', file=f)
    print('// Unscrunched code at: http://github.com/sixohsix/weird-player/', file=f)
    print('(function() {', file=f)
    print(data, file=f)
    print('})();', file=f)
