const fs = require('fs')
const { execSync } = require('child_process')

const directories = ['android', 'iphone', 'bearer', 'hardware']
const imageFolder = './images/wIcons'
const twcardFolder = './images/twcard'
const socialOutput = './images/social'

let totalFilesProcessed = 0
let totalErrors = 0
let startTime = Date.now()

directories.forEach((directory) => {
    const currentImageFolder = `${imageFolder}/${directory}/small` // Using the small folder for resized icons
    const mdFolder = `./_${directory}`
    const files = fs.readdirSync(currentImageFolder)

    files.forEach((file) => {
        if (file.endsWith('.png')) {
            const wsID = file.split('.png')[0]
            const mdFilePath = `${mdFolder}/${wsID}.md`

            if (fs.existsSync(mdFilePath)) {
                let data = fs.readFileSync(mdFilePath, 'utf8')

                const titleMatch = data.match(/title: (.+)/)
                const title = titleMatch ? titleMatch[1].replace('.', ',') : 'N/A'

                const versionMatch = data.match(/version: (.+)/)
                const version = versionMatch ? versionMatch[1].replace('.', ',') : 'N/A'

                const verdictMatch = data.match(/verdict: (.+)/)
                const verdict = verdictMatch ? verdictMatch[1].replace('.', ',') : 'N/A'

                let verdictDescription = `-pointsize 15 -fill black -draw "text 230,215 `;

                // Use an if statement to generate different output based on "verdict"
                if (verdict === 'custodial') {
                    const drawOption = `'Custodial: The provider holds the keys'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'diy') {
                    const drawOption = `'DIY: Do-It-Yourself Project'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'fake') {
                    const drawOption = `'Fake: The product mimics a popular competitor!'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'fewusers') {
                    const drawOption = `'Few users: This product has too few users for now to be reviewed in detail."`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'ftbfs') {
                    const drawOption = `'FTBFS: Failed to build from source provided!'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'nobinary') {
                    const drawOption = `'No Binary: This product comes without a binary.'"`;
                    verdictDescription += `${drawOption}`;
                }  
                else if (verdict === 'nobtc') {
                    const drawOption = `'No BTC: This wallet does not support Bitcoin.'"`;
                    verdictDescription += `${drawOption}`;
                }  
                else if (verdict === 'noita') {
                    const drawOption = `'Bad Interface: The device interface does not let you verify what is being signed'"`;
                    verdictDescription += `${drawOption}`;
                }  
                else if (verdict === 'nonverifiable') {
                    const drawOption = `'Not reproducible from source provided'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'nosendreceive') {
                    const drawOption = `'No sending or receiving bitcoins'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'nosource') {
                    const drawOption = `'No source for current release found'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'nowallet') {
                    const drawOption = `'Not an actual wallet'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'obfuscated') {
                    const drawOption = `'Obfuscated: The binary contains active obfuscation'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'obsolete') {
                    const drawOption = `'Obsolete: Not updated in a long time'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'outdated') {
                    const drawOption = `'Outdated: Review might be outdated'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'plainkey') {
                    const drawOption = `'Leaks Keys: This device requires sharing private key material!'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'prefilled') {
                    const drawOption = `'Prefilled: The device is delivered with the private keys as defined by the provider!'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'reproducible') {
                    const drawOption = `'Reproducible when tested'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'sealed-noita') {
                    const drawOption = `'Transactions are signed blindly'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'sealed-plainkey') {
                    const drawOption = `'Sealed Plainkey: Keys are sealed at first, but may be shared when spending'"`;
                    verdictDescription += `${drawOption}`;
                } else if (verdict === 'unreleased') {
                    const drawOption = `'Un-Released!'"`;
                    verdictDescription += `${drawOption}`;
                }  else if (verdict === 'vapor') {
                    const drawOption = `'Vaporware!'"`;
                    verdictDescription += `${drawOption}`;
                }  else if (verdict === 'wip') {
                    const drawOption = `'Review is Work in Progress'"`;
                    verdictDescription += `${drawOption}`;
                } else {
                    const drawOption = `'Unknown verdict'"`;
                    verdictDescription += `${drawOption}`;
                }

                


                const releasedMatch = data.match(/released: (.+)/)
                const released = releasedMatch ? releasedMatch[1].replace('.', ',') : 'N/A'

                const updatedMatch = data.match(/updated: (.+)/)
                const updated = updatedMatch ? updatedMatch[1].replace('.', ',') : 'N/A'

                const dateMatch = data.match(/date: (.+)/)
                const date = dateMatch ? dateMatch[1].replace('.', ',') : 'N/A'

                const developerNameMatch = data.match(/developerName: (.+)/)
                const developerName = developerNameMatch ? developerNameMatch[1].replace('.', ',') : 'N/A'

                const usersMatch = data.match(/users: (.+)/)
                const users = usersMatch ? usersMatch[1].replace('. ', ',') : 'N/A'
                
                try {
                const iconPath = `${currentImageFolder}/${wsID}.png`
                execSync(`convert ${twcardFolder}/twitterImageBGBig.png -font ./assets/fonts/Barlow/barlow-v12-latin-500.ttf \
                    -fill black \
                    -pointsize 26 -kerning 0 -draw "text 230,170 \\"${title}\\"" \
                    -pointsize 16 -kerning -1 -fill gray -draw "text 230,190 \\"version: ${version}\\"" \
                    ${verdictDescription}\
                    -draw "stroke gray stroke-width 1 line 230,225 670,225" \
                    -pointsize 18 -fill black -draw "text 230,250 'Developer:'" -fill gray -draw "text 350,250 '${developerName}'" \
                    -pointsize 18 -fill black -draw "text 230,275 'Downloads:'" -fill gray -draw "text 350,275 '${users}'" \
                    -pointsize 18 -fill black -draw "text 230,300 'Released on:'" -fill gray -draw "text 350,300 '${released}'" \
                    -pointsize 18 -fill black -draw "text 230,325 'Updated on:'" -fill gray -draw "text 350,325 '${updated}'" \
                    -pointsize 18 -fill black -draw "text 230,350 'Latest review:'" -fill gray -draw "text 350,350 '${date}'" \
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
