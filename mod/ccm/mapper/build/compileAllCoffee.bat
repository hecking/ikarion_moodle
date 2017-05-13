echo compiling all .coffee files in %1

pushd .
cd %1
for %%f in (*.coffee) do call coffee -c -m  %%~nf.coffee

popd