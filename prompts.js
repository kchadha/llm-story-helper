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

    diversify9: `For the given description of a subject, generate a list of exactly 4 different 
    variants for that subject. Keep all the attributes from the original description the same but choose 2 modifiers to add to make the original description slightly more detailed. Some modifiers to vary could be ethnicity, nationality, body type, disability markers, neurodiversity, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 

    These new description variants should be just one short sentence.
    
    The goal here is to help the user come up with a short description for a visual story.
    
    You want to help the user choose from rich and diverse options for the subject, but ultimately they will choose a description that feels right to them for their story.

    Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    diversify10: `For the given description of a subject, generate a list of exactly 4 different 
    variants for that subject. Keep all the attributes from the original description the same but choose 2 modifiers to add to make the original description slightly more detailed. Some modifiers to vary could be ethnicity, nationality, body type, gender, gender expression, disability markers, hair color, hair style,
    type of clothing / fashion aesthetic, age, personality. 

    These new description variants should be just one short sentence.
    
    The goal here is to help the user come up with a short description for a visual story.
    
    You want to help the user choose from rich and diverse options for the subject, but ultimately they will choose a description that feels right to them for their story.

    Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,


    keywordModifiers: `For the given prompt, add two keyword modifiers to the prompt. The modifiers should pertain to the subject of the prompt to provide
    give a few variants of it. Keep all the parts of the original prompt the same but just add these two new keyword descriptors to it.
    Some examples of things the modifiers can pertain to are: ethnicity, nationality, body type, disability markers (e.g. wheelchair, hearing device, etc.), hair color, hair style, or age.

    Generate a list of exactly 4 variants for the original subject.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.
    `,

    variantsRange: `For the given description of a subject, generate a range of exactly 4 different 
    variants for that subject. Each variant should be about the same original subject, but be slightly more descriptive than the last.
    
    Keep all the attributes from the user's original description the same but add more details for things that the user left unspecified to make the original description slightly more detailed.
    
    Some details to add could be ethnicity or nationality, body type, disability markers, hair color or style,
    type of clothing or fashion aesthetic, age, or personality.

    Each of these new description variants should be just one short sentence.
    
    The goal here is to help the user come up with a short description for a visual story.
    
    You want to help the user choose from rich and diverse options for the subject, but ultimately they will choose a description that feels right to them for their story.

    Treat each of the descriptors as separate unrelated attributes.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.`,

    keywordModifierEthnicity: `For the given prompt, add two keyword modifiers to the prompt. The modifiers should pertain to the subject of the prompt to provide
    give a few variants of it. Keep all the parts of the original prompt the same but just add these two new keyword descriptors to it.
    Some examples of things the modifiers can pertain to are: ethnicity, nationality, body type, disability markers (e.g. wheelchair, hearing device, etc.), hair color, hair style, or age.

    If the original prompt did not specify ethnicity, choose an ethnicity/nationality and one more modifier.

    Generate a list of exactly 4 variants for the original subject.
    
    Generate these variants as structured JSON data of a single key: 'variants' and the value of that key being an array of these string variants. DO NOT number the list of variants. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object.
    `,

    describeImage:
    `Given this image and corresponding description, create a new detailed but concise description of this image so that the description can be used to create a similar image. Describe the visual style of the image, the contents, the details about the subject including ethnicity and gender (if provided).
    Output the description starting with "A [visual style] of" for example "A digital illustration of"`,
    
    describeImage2:
    `Given this image and corresponding description, create a new detailed but concise description of the exact art style and contents of this image. Create a description that can be used to re-create the image. In generating the new description, prioritize the details from the user's original description of the image, especially the contents, the details about the subject including ethnicity and gender (if provided).
    Output the description starting with "A [visual style] of" for example "A digital illustration of"`,


    keywords: `For the given prompt, generate a list of exactly 16 keywords for adding detail to the prompt. These details are for creating an image of the given subject. 
    The keywords could pertain to the image itself such as the art style of the image (examples include: anime style, water color, photograph, drawing, coloring book, pixar style, cartoon), the setting/context, the mood of the image, and also additional attributes of the subject that were not specified in the original prompt e.g. ethnicity / nationality, age group, fashion aesthetic, or other interesting ideas.

    Do not include generic phrases like "ethnically diverse" or "multicultural". Do not include keywords that cannot be visualized, for example about the subject's accent. Instead try to choose specific details that would add something visual to the image. Only include keywords that are not already mentioned in the prompt.

    If the words "random sprite" are provided instead of the prompt, generate keywords for interesting subjects to create an image of. These could be simple subjects like people, animals, or creatures. It could also be objects or every day things that kids might interact with.
    If the words "random backdrop" are provided instead of the prompt, generate keywords for interesting settings that might appeal to kids. This could be familiar spaces like a room in a house, a playground, a school classroom, or fantastical places.

    Generate these keywords as structured JSON data of a single key: 'keywords' and the value of that key being an array of these string keywords. DO NOT number the list of keywords. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object. Do not number the keywords.
    `,
    
    keywords2: `For the given prompt, generate a list of exactly 16 keywords for adding detail to the prompt. These details are for creating an image of the given subject. 
    The keywords could pertain to the image itself such as the art style of the image (examples include: anime style, water color, photograph, drawing, coloring book, pixar style, cartoon), the setting/context, the mood of the image, and also additional attributes of the subject that were not specified in the original prompt e.g. ethnicity / nationality, age group, fashion aesthetic, or other interesting ideas.

    The keywords should NOT be generic phrases like "ethnically diverse" or "multicultural". DO NOT include keywords that cannot be visualized, for example about the subject's accent. Instead try to choose specific details that would add something visual to the image for example a description of a color palette, visual mood, additional subjects and elements. Only include keywords that are not already mentioned in the prompt.

    If the words "random sprite" are provided instead of the prompt, generate keywords for interesting subjects to create an image of. These could be simple subjects like people, animals, or creatures. It could also be objects or every day things that kids might interact with.
    If the words "random backdrop" are provided instead of the prompt, generate keywords for interesting settings that might appeal to kids. This could be familiar spaces like a room in a house, a playground, a school classroom, or fantastical places.

    Generate these keywords as structured JSON data of a single key: 'keywords' and the value of that key being an array of these string keywords. DO NOT number the list of keywords. Make sure all keys in the JSON object are lower case. Don't include any other text besides the full json object. Do not number the keywords.
    `
};