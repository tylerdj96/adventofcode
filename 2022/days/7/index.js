const fs = require("node:fs/promises");

const TOTAL = 100000;
const DIRSLESSTHANTOTAL = [];

async function day7() {
  try {
    const data = await fs.readFile("./input.txt", { encoding: "utf8" });
    const lines = data.split("\n");
    buildDirectory(lines);
  } catch (err) {
    console.log(err);
  }
}

day7();

const buildDirectory = (lines) => {
  const fileStructure = {};
  const cwd = [];
  lines.forEach((line) => {
    if (isCommand(line)) {
      if (isChangeDirectoryCommand(line)) {
        const newDirectory = getDirectoryName(line);
        if (newDirectory === "..") movecwdup(cwd);
        else movecwddown(cwd, newDirectory);
      }
    } else {
      const currentDirectory = getcwdinFS(fileStructure, cwd);
      if (isDirectoryOutput(line)) return;
      const fileName = getFileName(line);
      const fileSize = getFileSize(line);
      currentDirectory[fileName] = fileSize;
    }
  });
  prettyPrintFS(fileStructure);
};

const prettyPrintFS = (fs) => {
  prettyPrintDirectory("/", fs["/"], 0);
  //   DIRSLESSTHANTOTAL.forEach((dir) =>
  //     console.log(`${dir["directoryName"]} - ${dir["directorySize"]}`),
  //   );
  console.log(
    `TOTAL # of dirs smaller than ${TOTAL}: ${DIRSLESSTHANTOTAL.length}`,
  );
  console.log(
    `SUM of sizes of dirs smaller than ${TOTAL}: ${DIRSLESSTHANTOTAL.reduce(
      (runningTotal, currTotal) => runningTotal + currTotal["directorySize"],
      0,
    )}`,
  );
};

const prettyPrintDirectory = (directoryName, directory, depth) => {
  console.log(`${" ".repeat(depth)} - ${directoryName} (dir)`);
  let directorySize = 0;
  Object.entries(directory).forEach(([name, val]) => {
    if (Object.values(val).length > 0)
      directorySize += prettyPrintDirectory(name, val, depth + 1);
    else directorySize += prettyPrintFile(name, val, depth + 1);
  });
  if (directorySize <= TOTAL)
    DIRSLESSTHANTOTAL.push({ directoryName, directorySize });
  return directorySize;
};

const prettyPrintFile = (fileName, size, depth) => {
  console.log(`${" ".repeat(depth)} - ${fileName} (file, size=${size})`);
  return size;
};

const getcwdinFS = (fs, cwd) => {
  let index = 0;
  while (fs != null && index < cwd.length) {
    if (!fs[cwd[index]]) fs[cwd[index]] = {};
    fs = fs[cwd[index++]];
  }
  return fs;
};

const movecwdup = (cwd) => {
  cwd.pop();
};

const movecwddown = (cwd, newDir) => {
  return cwd.push(newDir);
};

const isCommand = (line) => {
  if (line.substring(0, 1) === "$") return true;
  return false;
};

const isChangeDirectoryCommand = (line) => {
  if (line.substring(2, 4) === "cd") return true;
  return false;
};

const isDirectoryOutput = (line) => {
  if (line.substring(0, 3) === "dir") return true;
  return false;
};

const getDirectoryName = (line) => {
  return line.trim().substring(4, line.length).trim();
};

const getFileName = (line) => {
  return line.trim().substring(line.indexOf(" "), line.length).trim();
};

const getFileSize = (line) => {
  return Number(line.substring(0, line.indexOf(" ")));
};
