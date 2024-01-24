const fs = require('fs');
const csv = require('csv-parser');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const repos = [];

// Step 1: Read and iterate through the CSV file
fs.createReadStream('repos.csv')
  .pipe(csv())
  .on('data', (row) => {
    repos.push(row.githubLink);
  })
  .on('end', () => {
    // Step 2: Ask the user to choose repos
    inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'selectedRepos',
          message: 'Select repositories to clone:',
          choices: repos,
        },
      ])
      .then((answers) => {
        const selectedRepos = answers.selectedRepos;

        // Step 3: Ask the user for coding file names
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'fileNames',
              message: 'Enter coding file names (comma-separated):',
            },
          ])
          .then((fileNamesAnswers) => {
            const codingFileNames = fileNamesAnswers.fileNames.split(',');

            // Step 4: Ask the user to enter rock, paper, or scissors
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'choice',
                  message: 'Choose rock, paper, or scissors:',
                  choices: ['rock', 'paper', 'scissors'],
                },
              ])
              .then((choiceAnswer) => {
                const choice = choiceAnswer.choice;

                // Step 5: Clone selected repos and perform actions
                selectedRepos.forEach((repo) => {
                  const folderName = repo.split('/').pop().replace('.git', '');
                  execSync(`git clone ${repo}`);
                  execSync(`cd ${folderName}`);

                  codingFileNames.forEach((fileName) => {
                    execSync(`echo "${choice}" >> ${fileName}`);
                  });

                  execSync(`git checkout -b feat/rps`);
                  execSync(`git add .`);
                  execSync(`git commit -m "adding an rps"`);
                  execSync(`git push origin feat/rps`);

                  // Return to the root directory
                  execSync('cd ..');
                });

                console.log('Process completed successfully!');
              });
          });
      });
  });
