/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */


// Initialize the Piston client with the Piston API endpoint
// const client  = new piston({
//   baseURL: "https://emkc.org", // Replace with the actual Piston API endpoint
// });




module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("pull_request.opened", async (context) => {
    // Extract the code snippet to execute
    const commentBody = context.payload.pull_request.body;
    // const codeToExecute = extractCodeToExecute(commentBody);

   
      try {

        const {piston} = await import('piston-client');
        

        const client = piston({ server: "https://emkc.org" });

        console.log("piston", piston);

        // Execute the code using the Piston API client
        const executionResult = await client.execute('javascript', 'console.log("Hello world!")', { language: '3.9.4 '});

        // Post the execution result as a comment on the pull request
        const commentUrl = context.payload.pull_request.html_url;
        console.log('commentUrl', commentUrl)
        await context.octokit.issues.createComment({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: context.payload.pull_request.number,
          body: `Execution Result:\n\n\`\`\`\n${executionResult}\n\`\`\`\n`,
        });
      } catch (e) {
        console.error("Error executing code with Piston:", e);
      }
    

    // Handle the pull request creation event here
    const pr = context.payload.pull_request;
    const owner = pr.base.repo.owner.login;
    const repo = pr.base.repo.name;
    // Add your comment logic here
    const comment = "Thank you for creating this pull request!";
    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: comment,
    });
  });



  app.on("issue_comment.created", async (context) => {
    const {payload} = context
    
    // const {piston} = await import('piston-client');
        

    // const client = piston({ server: "https://emkc.org" });

    // console.log("piston", piston);

    // // Execute the code using the Piston API client
    // const executionResult = await client.execute('javascript', 'console.log("Hello world!")',
    //  { language: '3.9.4 '});


    if(payload.issue.pull_request){
      console.log("we got the pull request")
      const prNumber = payload.issue.number;
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const commentBody = payload.comment.body;
      

      if (commentBody.includes('/execute')) {
        console.log("we are inside the second if ")
        // Perform your action here, e.g., post another comment or update the pull request.
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber.number,
          body: "Your custom action has been triggered.",
        });
    }
  }
    
  });


  // function extractCodeToExecute(commentBody) {
  //   console.log("commentbody", commentBody)
  //   // Define a regular expression pattern to match JavaScript code blocks
  //   const codeBlockRegex = /```(javascript|js)([\s\S]*?)```/g;
  
  //   // Initialize an array to store extracted JavaScript code snippets
  //   const extractedCodeSnippets = [];
  
  //   let match;
  //   while ((match = codeBlockRegex.exec(commentBody)) !== null) {
  //     const codeSnippet = match[2];
  
  //     // Add the code snippet to the array
  //     extractedCodeSnippets.push(codeSnippet);
  //   }
  
  //   // Combine the extracted JavaScript code snippets into a single string
  //   const combinedCode = extractedCodeSnippets.join('\n');
  //   console.log("combineCode", combinedCode)
  
  //   return combinedCode;
  // }
  

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
