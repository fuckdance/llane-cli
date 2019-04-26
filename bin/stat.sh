#!/bin/bash

# mkdir -p ./tmp
cd ./tmp
rm -rf ./*

for i in "$@"; do
  if [ $(grep '.git' <<< $i) ]
  then
    git clone $i
  fi
  # printf $i
  # printf  $(grep '.git' <<< $i; $?) 
done

add=0;
rows=0;
for p in $(ls ./); do 
  cd "$p/" 

  # 统计变更行数
  rn=$(git whatchanged --author=$1 --stat --oneline | grep '^\s[[:digit:]]' | awk '{sum+=$4}END{print sum}')
  if [ $rn ]
  then
    rows=`expr $rn + $rows`
  fi

  # 统计提交次数
  line=$(git log --all --oneline --pretty="%an" | sort | uniq -c | grep $1 | awk '{print $1}')
  if [ $line ]
  then
    add=`expr $line + $add`
  fi
  cd ../

done
printf "%s commits, %s rows" $add $rows 


