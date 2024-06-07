import OpenAI from 'openai';

const openai = new OpenAI();

const delay = ms => new Promise(res => {
    console.log("Starting delay");
    return setTimeout(res, ms)
});

class Agent {
    constructor (name, instructions, userPrompt='', optAddtionalInstructions = '') {
        this.name = name;
        this.instructions = instructions;
        this.userPrompt = userPrompt;
        this.additionalInstructions = optAddtionalInstructions;
        this.assistant = null;

        // this.status = '';
        // this.intervalId = null;

        // this.messageObj = null;

        // this.loopStep = null;

        this.checkRunStatus = this.checkRunStatus.bind(this);
        // this.step = this.step.bind(this);
        this.initializeThread = this.initializeThread.bind(this);
        this.setupAssistant = this.setupAssistant.bind(this);
        this.loopStep = this.loopStep.bind(this);
        this.newPrompt = this.newPrompt.bind(this);
    }

    async setupAssistant () {
        console.log("Creating assistant.")
        this.assistant = await openai.beta.assistants.create({
            name: this.name,
            instructions: this.instructions,
            model: 'gpt-4o'
        });
    }

    async initializeThread () {
        console.log("Creating thread");
        const thread = await openai.beta.threads.create();
        return thread.id;
    }

    async newPrompt (threadId, userPrompt) {
        console.log("Creating message");
        this.message = await openai.beta.threads.messages.create(
            threadId,
            {role: 'user', content: userPrompt}
        );
        
        console.log("Creating run");
        const newRun = await openai.beta.threads.runs.create(
            threadId,
            { 
                assistant_id: this.assistant.id,
                additional_instructions: this.additionalInstructions
            }
        );

        return newRun.id;

    }

    // loopStep (threadId, runId) {
    //     return new Promise((resolve, reject) => {

    //         // console.log("Step Promise");

    //         const keepChecking = async status => {
    //             console.log("Keep Checking... ", status);
    //             const completed = status === 'completed';
    //             const errored = status === 'expired' || status === 'cancelling' || status === 'cancelled' || status === 'failed';
                
    //             if (completed) {
    //                 console.log('Completed');
    //                 const messages = await openai.beta.threads.messages.list(threadId);
    //                 const message = messages.data[0].content[0].text.value;
    //                 try {
    //                     return resolve(JSON.parse(message));
    //                 } catch (e) {
    //                     console.log("JSON.parse failed, here's the message: ", message);
    //                 }
    //             }
                
    //             if (errored) {
    //                 return reject(status);
    //             }

    //             console.log("Starting loop");
    //             return delay(5000)
    //                 .then(this.checkRunStatus(threadId, runId))
    //                 .then(s => keepChecking(s));
    //         }

    //         return resolve(keepChecking(''));
    //     });
    // }

    loopStep(threadId, runId) {
        return this.checkRunStatus(threadId, runId)
            .then(s => {
                console.log("Keep Checking... ", s);
                const completed = s === 'completed';
                const errored = s === 'expired' || s === 'cancelling' || s === 'cancelled' || s === 'failed';
                
                if (errored) {
                    return Promise.reject(s);
                }

                if (completed) {
                    console.log('Completed');
                    return Promise.resolve(openai.beta.threads.messages.list(threadId)
                        .then(messages => {
                            let message = messages.data[0].content[0].text.value;
                            message = message.replace('```json', '').replace('```', '').trim();
                            try {
                                return Promise.resolve(JSON.parse(message));
                            } catch (e) {
                                console.log("JSON.parse failed, here's the message: ", message);
                                return Promise.resolve(null);
                                // return Promise.reject(`JSON.parse failed, here's the message: ${e}`);
                            }
                        }));
                }
                
                return delay(2000).then(() => this.loopStep(threadId, runId));
            });
    }

    checkRunStatus (threadId, runId) {
        console.log("Checking run status");

        return Promise.resolve(
            openai.beta.threads.runs.retrieve(threadId,runId)
            .then(r => {
                console.log("Status: ", r.status);
                    return r.status;
            })
        );
    
        // return new Promise(resolve => {
        //     console.log("Checking run status");
        //     resolve(
        //         openai.beta.threads.runs.retrieve(threadId,runId)
        //         .then(r => {
        //             // this.status = r.status;
        //             console.log("Status: ", r.status);
        //             return r.status;
        //         })
        //     );  
        // });
    }

    // async step () {
    //     console.log(`Running step: ${this.intervalId}, ${this.status}`);
        
    //     if (!this.intervalId) return;
    //     if (!!this.status) return;

    //     await this.checkRunStatus();
        
    //     if (this.status === 'completed') {
    //         console.log("Completed");
    //         clearInterval(this.intervalId);
    //         this.intervalId = null;
    //         // this.status = '';

    //         this.messages = await openai.beta.threads.messages.list(
    //             thread.id
    //         );
            
    //         debugger;

    //         const message = this.messages.data[0].content[0].text.value;

    //         if (message.startsWith('{')) {
    //             this.messageObj = JSON.parse(message);
    //         }
    //     }
    // }
}

export default Agent;