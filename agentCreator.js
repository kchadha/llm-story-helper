import OpenAI from 'openai';

const openai = new OpenAI();

const delay = ms => new Promise(res => {
    console.log("Starting delay");
    return setTimeout(res, ms)
});

class Agent {
    constructor (name, instructions, userPrompt, optAddtionalInstructions = '') {
        this.name = name;
        this.instructions = instructions;
        this.userPrompt = userPrompt;
        this.additionalInstructions = optAddtionalInstructions;

        this.status = '';
        this.intervalId = null;

        this.messageObj = null;

        this.stepPromise = null;

        this.checkRunStatus = this.checkRunStatus.bind(this);
        this.step = this.step.bind(this);
        this.initialize = this.initialize.bind(this);
    }

    async initialize () {
        console.log("Creating assistant.")
        this.assistant = await openai.beta.assistants.create({
            name: this.name,
            instructions: this.instructions,
            model: 'gpt-4'
        });

        console.log("Creating thread");
        this.thread = await openai.beta.threads.create();

        console.log("Creating message");
        this.message = await openai.beta.threads.messages.create(
            this.thread.id,
            {role: 'user', content: this.userPrompt}
        );

        console.log("Creating run");
        this.run = await openai.beta.threads.runs.create(
            this.thread.id,
            { 
                assistant_id: this.assistant.id,
                additional_instructions: this.additionalInstructions
            }
        );
        
        this.stepPromise = new Promise((resolve, reject) => {
            console.log("Step Promise");

            const keepChecking = async () => {
                console.log("Keep Checking...");
                const completed = this.status === 'completed';
                const errored = this.status === 'expired' || this.status === 'cancelling' || this.status === 'cancelled' || this.status === 'failed';
                
                if (completed) {
                    console.log('Completed');
                    this.messages = await openai.beta.threads.messages.list(
                        this.thread.id
                    );
                    const message = this.messages.data[0].content[0].text.value;
                    try {
                        this.messageObj = JSON.parse(message);
                    } catch (e) {
                        console.log("JSON.parse failed, here's the message: ", message);
                        this.messageObj = message;
                    }
                    
                    return resolve(this.messageObj);
                }
                
                if (errored) {
                    return reject(this.status);
                }

                console.log("Starting loop");
                return delay(5000).then(this.checkRunStatus).then(keepChecking);
            }

            keepChecking();
        });
    }

    checkRunStatus () {
        return new Promise(resolve => {
            console.log("Checking run status");
            return openai.beta.threads.runs.retrieve(
                this.thread.id,
                this.run.id
            ).then(r => {
                this.status = r.status;
                console.log("Status: ", this.status);
                return resolve(this.status);
            });  
        });
    }

    async step () {
        console.log(`Running step: ${this.intervalId}, ${this.status}`);
        
        if (!this.intervalId) return;
        if (!!this.status) return;

        await this.checkRunStatus();
        
        if (this.status === 'completed') {
            console.log("Completed");
            clearInterval(this.intervalId);
            this.intervalId = null;
            // this.status = '';

            this.messages = await openai.beta.threads.messages.list(
                thread.id
            );
            
            debugger;

            const message = this.messages.data[0].content[0].text.value;

            if (message.startsWith('{')) {
                this.messageObj = JSON.parse(message);
            }
        }
    }
}

export default Agent;