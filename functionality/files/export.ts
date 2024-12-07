import { Loopy } from "@/datatypes/commondatatypes";

export function ExportDiagramAsJSON(loopy: Loopy){
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(loopy));
    var donwloadButton = document.createElement('a')
    donwloadButton.href = 'data:' + data
    donwloadButton.download = 'loopy.json'
    donwloadButton.innerHTML = 'download JSON'

    donwloadButton.click()
}