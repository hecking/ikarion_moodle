echo compiling all .less files in %1

pushd .
cd %1
for %%f in (*.less) do call lessc %%~nf.less %%~nf.css

popd