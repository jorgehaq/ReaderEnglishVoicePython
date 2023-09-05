import os
from googletrans import Translator
from time import sleep
from flask import Flask, render_template, render_template_string, Markup


app = Flask(__name__)


@app.route('/')
def index():
    file_path = os.path.join(os.path.dirname(
        __file__), 'MR.ROBOT.S1/Mr. Robot - 1x01.txt')
    with open(file_path, 'r') as file:
        linked_paragraph = file.read()    

    linked_paragraph=linked_paragraph.replace("...", "|")       

    paragraphs=linked_paragraph.split(".")

    enter_separate = [
        f'<a href="#" class="link" data-text="{paragraph}.">{paragraph}.</a>' for paragraph in paragraphs]

    linked_paragraph = "<br><br>".join(enter_separate)

    linked_paragraph=linked_paragraph.replace("|", "...")  

    return render_template('index.html', content=Markup(linked_paragraph))





@app.route('/translate_word/<paragraph>')
def translate_word(paragraph):

    translator = Translator()

    # Translate a sentence from English to Spanish
    translation = translator.translate(paragraph, dest='es')

    #final_send="<p><b>"+paragraph+"</b>: "+translation.text+"</p>"

    translated_info="<span class='active-link'>Translation:</span> "+translation.text+"</p>"

    return translated_info



if __name__ == '__main__':
    app.run(port=8000, debug=False)
