import React, { useState, useEffect } from 'react';
import {Wrapper, Card, Templates, Form, Button} from './styles';
import logo from '../../images/logo.svg'
import qs from 'qs';



export default function Home(){

  const [templates, setTemplates]= useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState(null)
  const [boxes, setBoxes] = useState([]);
  const [generatedMeme, setGeneratedMeme ] = useState(null)

  useEffect(() => {
    (async ()=>{
      const resp = await fetch('https://api.imgflip.com/get_memes')
      const {data: { memes }} = await resp.json();
      setTemplates(memes);

    })();
    
  }, []);

  function handleSelectTemplates(template){
    setSelectedTemplates(template)
    setBoxes([])
  }

  async function handleSubmit(e){
    e.preventDefault();
    const params = qs.stringify({
      template_id: selectedTemplates.id,
      username: 'isaque.lourenco',
      password: 'isaque.lourenco',
      boxes: boxes.map(text => ({ text })),
    })
    const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`)
    const { data: { url }} = await resp.json()

    setGeneratedMeme(url)
  }

  // currying -> função que retorna outra função
  const handleInputChange = (index)=>(e)=>{
    const newValues = boxes;
    newValues[index]= e.target.value;
    setBoxes(newValues);
  }

  function handleReset(){

    setSelectedTemplates(null)
    setBoxes([])
    setGeneratedMeme(null)
    
  
  }

  return(
    <Wrapper>
      <img src={logo} alt="MemeMaker" />
      <Card>
        {generatedMeme && (
          <>
            <img src={ generatedMeme } alt="Generated Meme" />
            <Button 
            type='button'
            onClick={handleReset}
            >Criar outro Meme</Button>
          </>
        )}
        {!generatedMeme && (
          <>
            <h2>Selecione um template</h2>
        <Templates>
          {templates.map((template) =>(
            <button
            key={template.id}
            type='button'
            onClick={()=> handleSelectTemplates(template)}
            className={template.id === selectedTemplates?.id ? 'selected' : ''}
            >
              <img src={template.url} alt={template.name} />
            </button>
          ))}         
        </Templates>
        {selectedTemplates && (
          <>
            <h2>Textos</h2>
            <Form onSubmit={handleSubmit} >
              {(new Array(selectedTemplates.box_count)).fill('').map((_, index)=>(
                <input 
                key={String(Math.random())}
                placeholder={`Texto #${index + 1}`} 
                onChange={handleInputChange(index)}
                />
              ))}
              
              
              
              <Button type='submit'>MakeMyMeme!</Button>
            </Form>
          </>
        )}
          </>
        )}
      </Card>

    </Wrapper>

  ) 
}