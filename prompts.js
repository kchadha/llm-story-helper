export default {
    sceneOrganizer:
    `You help break down the description of a story or scene in a story into a json object representing the separate components like the backdrop or setting, the subjects, the activity, any relevant objects.
    For example if the user is trying to create a story about friends playing a pick up basketball game, generate structured data like the following:
    backdrop: park basketball court
    subjects: a group of 3 friends, one male, one female, one non-binary
    activity: playing basketball
    objects: basketball
    
    Generate these as structured JSON data. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object of components.`,

    variants: `For each part of the given JSON object, you should generate fun, creative, and diverse variants.
    Some examples of variants might be:
    Backdrop: park basketball court
    Variants: soccer field, outer space, rainforest, under the sea

    Subject: A young girl
    Variants: A 10 year old Asian-American girl, A 14 year old African androgenous female, a teenage girl from Peru
    
    Generate these as structured JSON data. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify: `For the given description of a person, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that person. Some descriptors to include in the variants could be ethnicity or nationality, hair color and style,
    type of clothing / fashion aesthetic, age, personality. The goal here is to help the user come up with a detailed character description that could
    easily be visualized (for example in the context of a story). You want to help the user choose from rich and diverse options for
    characters, but ultimately they will choose a description that feels right to them for their story.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify2: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity or nationality, body type, ability, hair color and style,
    type of clothing / fashion aesthetic, age, personality.
    
    The goal here is to help the user come up with a detailed character description that could
    easily be visualized (for example in the context of a story).
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify3: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality.
    
    The goal here is to help the user come up with a detailed character description that could
    easily be visualized (for example in the context of a story).
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`, 

    diversify4: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 
    
    Generate descriptions that are appropriate for children ages 8 to 16.
    
    The goal here is to help the user come up with a detailed character description that could
    easily be visualized (for example in the context of a story).
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify5: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 
    
    Generate descriptions that are appropriate for children between elementary school and high school.
    
    The goal here is to help the user come up with a detailed character description that could
    easily be visualized (for example in the context of a story).
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify6: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 
    
    Generate descriptions that are appropriate for children between elementary school and high school.
    
    The goal here is to help the user come up with a a prompt for an image generator to create a character for a visual story.
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify7: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 
    
    The goal here is to help the user come up with a a prompt for an image generator to create a character for a visual story.
    
    You want to help the user choose from rich and diverse options for characters, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify8: `For the given description of a subject, generate a list of exactly 4 different vividly detailed descriptions of 
    variants for that subject. These variants should be just one short sentence. Some descriptors to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 
    
    The goal here is to help the user come up with a short description for a visual story.
    
    You want to help the user choose from rich and diverse options for the subject, but ultimately they will choose a description that feels right to them for their story.

    Stay away from stereotypes. Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,
};