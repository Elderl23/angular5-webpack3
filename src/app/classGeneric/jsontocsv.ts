import { ClassGenerica } from '../classGeneric/config';
import json2csv from 'json2csv';

export class JsonToCsv extends ClassGenerica{
  constructor(){
    super();
  }


  protected Json2csv(fields,data,fieldNames,nameFile):any{
    try {
      let result = json2csv({ data: data, fields: fields, fieldNames: fieldNames });
      
       this.downloadFileCsv(result,nameFile);
    } catch (err) {
      // Errors are thrown for bad options, or if the data is empty and no fields are provided.
      // Be sure to provide fields if it is  possible that your data array will be empty.
      console.log(err);

      
    }
  }

  private downloadFileCsv(data,nameFile):any{
    let blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }

    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", nameFile);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);

  }
}



