const fs = require('fs')
const { execSync } = require('child_process')

const directories = ['android', 'iphone', 'bearer', 'hardware']
const imageFolder = './images/wIcons' // Updated directory
const twcardFolder = './images/twcard'
const socialOutput = './images/social'

let totalFilesProcessed = 0
let totalErrors = 0
let startTime = Date.now()

directories.forEach((directory) => {
    const currentImageFolder = `${imageFolder}/${directory}` // Removed the /small subdirectory
    const mdFolder = `./_${directory}`
    const files = fs.readdirSync(currentImageFolder)

    files.forEach((file) => {
        if (file.endsWith('.png')) {
            const wsID = file.split('.png')[0]
            const mdFilePath = `${mdFolder}/${wsID}.md`

            if (fs.existsSync(mdFilePath)) {
                // ... (rest of your existing code to fetch metadata)
                
                try {
                    const iconPath = `${currentImageFolder}/${wsID}.png`
                    execSync(`convert ${iconPath} -resize 140x140 -roundRectangle 140,140,30,30 ${iconPath}`) // Resize and round edges
                    execSync(`convert ${twcardFolder}/twitterImageBG600x600.jpg -font ./assets/fonts/Barlow/barlow-v12-latin-500.ttf \
                        -fill black \
                        // ... (rest of your existing code to overlay text and icons)
                        ${iconPath} -geometry +100+150 -composite \
                        ${socialOutput}/${directory}/${file}`)

                    totalFilesProcessed++
                } catch (error) {
                    console.error('Error processing file:', file, "Error message:", error.message)
                    totalErrors++
                }
                
            }
        }
    })
})

let endTime = Date.now()
let totalTime = (endTime - startTime) / 1000

console.log(`Total files processed: ${totalFilesProcessed}`)
console.log(`Total errors: ${totalErrors}`)
console.log(`Total time it took to process: ${totalTime} seconds`)
