
<img src="https://i.imgur.com/i2oWxOZ.png" alt="FormuFlash" width="100%"/>

## Introduction
Welcome to the [FormuFlash](https://formuflash.com/) project! This repository contains a flashcard app with LaTeX and Markdown support to create the ultimate STEM studying tool.

## Features
- **LaTeX**: Flashcards with LaTeX-rendered mathematical equations and formulas.
- **Markdown**: Markdown formatting for easy readability and organization.
- **Images**: Image support for adding visual aids and diagrams.
- **Link**: Link support for referencing external resources and study materials.
- **Shortcuts**: Use shortcuts to interact with the app such as *ctrl + s* to save, *space* to view the answer, *1,2,3* to submit card confidence 
- **Courses & Decks**: Organize your cards into different courses and decks
- **Seamless transition**: Easily import you current flashcards from other platforms (or export them if FormuFlash isn't for you)

## Instalation
Just kidding :) Simply open the following [link](https://formuflash.com/) in your preferred web browser

## Usage
1. [Create an account](https://formuflash.com/register/)
2. Create a course
3. Create a deck
4. Start editing

### Latex Usage
Latex (KaTeX) works a little differently (to make it easier to use) than on other editors such as [Overleaf](https://www.overleaf.com/). You don't need the ```\begin{document}```, ```\end{equation}```, etc..

#### 1. Expressions 
When editing type ```$$``` (inline) or ```$$$$``` (will centre the expression) to render an expression. For example: 
- ```$2 + 2 = 4$```: $2 + 2 = 4$
- ```$$e^{\pi \i} + 1 = 0$$```: $$e^{\pi i} + 1 = 0$$ (note how the double ```$$``` centres the expression)

#### 2. Exponents and Subscripts
You may use ```$^$``` and ```$_$``` for exponents and subscripts (respectively). For example:

- ```$a^b$```: $a^b$
- ```$a_{b}$```: $a_{b}$

#### 2. Special characters
Type ```\<char>{}{}``` to include a special character such as a fractions, greek letter or integrals. Note that the curly braces may not be necesary for some characters. For example:

- ```$\frac{1}{2}$```: $\frac{1}{2}$
- ```$\pi$```: $\pi$
- ```$\int_{a}^{b} x dx$```: $\int_{a}^{b} x dx$

### Markdown Usage
Exactly the same way as in GitHub's README files (note that it doesn't support html rendering). For example:
- ```# <Text>``` for Header 1
- ```## <Text>``` for Header 2
- ```n*# <Text>``` for Header n (not literally n*# but rather n number of #)
- ```*<Text>*``` for *italic* text
- ```**<Text>**``` for **bold** text
- ```***<Text>***``` for ***italic and bold*** text
- ```-``` for unordered lists
- ```n.``` for ordered lists
- ```[<Link Text>](<url>)``` for [links](https://formuflash.com/)
- ```![<Alt Text>](<url>)``` for images
- ```>``` for indents (you can type multiple together for multiple indents)

And many more, note that some features such as tables aren't supported.


## Project Structure

The project structure is organized as follows:

- `backend`: Backend consisting of a django-rest API
- `frontend`: Frontend consisting of React with TypeScript and Vite
- `nginx`: Nginx reverse proxy configuration
- `LICENSE`: Creative Common license
- `README.md`: This file.
- `docker-compose.yaml`: Local container build (unused in production)

The project is deployed to [Google Cloud Platform](https://cloud.google.com/) as individual [Cloud Run](https://cloud.google.com/run?hl=en) instances managed by a load balancer using cloud dns for an external domain

## Contributing
Contributions are welcome! Please submit a pull request with your changes and a brief description of the updates.

## License
This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
Public License license. You may view, modify and run the code locally but any deployment and monetisation of such code is totally prohibited.